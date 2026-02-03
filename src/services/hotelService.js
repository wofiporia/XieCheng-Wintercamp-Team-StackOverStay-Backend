const db = require('../config/database');
const HttpError = require('../utils/httpError');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function normalizeDate(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }
  return value;
}

function normalizePagination(page, pageSize) {
  const parsedPage = Number(page) || DEFAULT_PAGE;
  const parsedPageSize = Math.min(Number(pageSize) || DEFAULT_PAGE_SIZE, 50);
  return {
    page: parsedPage < 1 ? DEFAULT_PAGE : parsedPage,
    pageSize: parsedPageSize < 1 ? DEFAULT_PAGE_SIZE : parsedPageSize,
  };
}

function buildPriceSubquery(startDate, endDate) {
  return db('rooms as r')
    .select('r.hotel_id')
    .min({ min_price: 'rpc.price' })
    .join('rate_plans as rp', 'rp.room_id', 'r.id')
    .join('room_price_calendar as rpc', 'rpc.rate_plan_id', 'rp.id')
    .where('rpc.stay_date', '>=', startDate)
    .andWhere('rpc.stay_date', '<=', endDate)
    .andWhereRaw('(rpc.inventory - rpc.sold) > 0')
    .groupBy('r.hotel_id');
}

async function resolveTagIds(codes = []) {
  if (!codes.length) return [];
  const rows = await db('tags').select('id').whereIn('code', codes);
  return rows.map((row) => row.id);
}

async function listHotels(params) {
  const {
    cityId,
    keyword,
    starMin,
    starMax,
    priceMin,
    priceMax,
    sort,
    tags: tagsParam,
    checkIn,
    checkOut,
    page,
    pageSize,
  } = params;

  const tagCodes = tagsParam
    ? tagsParam
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const tagIds = await resolveTagIds(tagCodes);

  const startDate = normalizeDate(checkIn);
  const endDate = checkOut ? normalizeDate(checkOut) : startDate;
  const { page: currentPage, pageSize: size } = normalizePagination(page, pageSize);
  const priceSubquery = buildPriceSubquery(startDate, endDate);
  const priceColumn = db.raw('COALESCE(price_info.min_price, h.min_price_cache)');

  const baseQuery = db('hotels as h')
    .leftJoin(priceSubquery.as('price_info'), 'price_info.hotel_id', 'h.id')
    .leftJoin('cities as c', 'c.id', 'h.city_id')
    .where('h.status', 1)
    .modify((qb) => {
      if (cityId) {
        qb.andWhere('h.city_id', cityId);
      }
      if (keyword) {
        qb.andWhere((inner) => {
          inner.whereILike('h.name', `%${keyword}%`).orWhereILike('h.address', `%${keyword}%`);
        });
      }
      if (starMin) {
        qb.andWhere('h.star_rating', '>=', Number(starMin));
      }
      if (starMax) {
        qb.andWhere('h.star_rating', '<=', Number(starMax));
      }
      if (typeof priceMin !== 'undefined') {
        qb.andWhereRaw('COALESCE(price_info.min_price, h.min_price_cache) >= ?', [Number(priceMin)]);
      }
      if (typeof priceMax !== 'undefined') {
        qb.andWhereRaw('COALESCE(price_info.min_price, h.min_price_cache) <= ?', [Number(priceMax)]);
      }
      if (tagIds.length) {
        qb.whereIn('h.id', function subquery() {
          this.select('hotel_id').from('hotel_tags').whereIn('tag_id', tagIds);
        });
      }
    });

  const countResult = await baseQuery
    .clone()
    .clearSelect()
    .clearOrder()
    .countDistinct({ total: 'h.id' })
    .first();
  const total = Number(countResult?.total || 0);

  const sortField = (() => {
    switch (sort) {
      case 'price_desc':
        return { column: priceColumn, direction: 'desc' };
      case 'star_desc':
        return { column: 'h.star_rating', direction: 'desc' };
      case 'price_asc':
      default:
        return { column: priceColumn, direction: 'asc' };
    }
  })();

  const rows = await baseQuery
    .clone()
    .select(
      'h.id',
      'h.name',
      'h.address',
      'h.star_rating as starRating',
      'h.lat',
      'h.lng',
      'h.extra',
      'c.id as cityId',
      'c.name as cityName',
      'c.country_code as countryCode',
      db.raw('COALESCE(price_info.min_price, h.min_price_cache) as "minPrice"')
    )
    .orderBy(sortField.column, sortField.direction)
    .orderBy('h.id', 'asc')
    .offset((currentPage - 1) * size)
    .limit(size);

  const hotelIds = rows.map((row) => row.id);
  let tagsMap = {};
  if (hotelIds.length) {
    const tags = await db('hotel_tags as ht')
      .leftJoin('tags as t', 't.id', 'ht.tag_id')
      .select('ht.hotel_id as hotelId', 't.code', 't.name')
      .whereIn('ht.hotel_id', hotelIds);
    tagsMap = tags.reduce((acc, item) => {
      if (!acc[item.hotelId]) acc[item.hotelId] = [];
      acc[item.hotelId].push({ code: item.code, name: item.name });
      return acc;
    }, {});
  }

  return {
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      starRating: Number(row.starRating || 0),
      minPrice: row.minPrice ? Number(row.minPrice) : null,
      city: row.cityId
        ? {
            id: row.cityId,
            name: row.cityName,
            countryCode: row.countryCode,
          }
        : null,
      coordinates: row.lat && row.lng ? { lat: Number(row.lat), lng: Number(row.lng) } : null,
      tags: tagsMap[row.id] || [],
      quickFacts: (row.extra && row.extra.quickFacts) || [],
    })),
    meta: {
      page: currentPage,
      pageSize: size,
      total,
      appliedFilters: {
        cityId: cityId || null,
        keyword: keyword || null,
        checkIn: startDate,
        checkOut: endDate,
        tagCodes,
      },
    },
  };
}

async function getHotelById(id) {
  const hotel = await db('hotels as h')
    .leftJoin('cities as c', 'c.id', 'h.city_id')
    .select(
      'h.id',
      'h.name',
      'h.address',
      'h.star_rating as starRating',
      'h.lat',
      'h.lng',
      'h.extra',
      'h.check_in_time as checkInTime',
      'h.check_out_time as checkOutTime',
      'c.id as cityId',
      'c.name as cityName',
      'c.country_code as countryCode',
    )
    .where('h.id', id)
    .andWhere('h.status', 1)
    .first();

  if (!hotel) {
    throw new HttpError(404, 'Hotel not found', 2001);
  }

  const photos = await db('hotel_photos')
    .select('id', 'url', 'type', 'sort_order as sortOrder')
    .where('hotel_id', id)
    .orderBy('sort_order', 'asc');

  const tags = await db('hotel_tags as ht')
    .leftJoin('tags as t', 't.id', 'ht.tag_id')
    .select('t.code', 't.name')
    .where('ht.hotel_id', id);

  return {
    id: hotel.id,
    name: hotel.name,
    address: hotel.address,
    starRating: Number(hotel.starRating || 0),
    coordinates: hotel.lat && hotel.lng ? { lat: Number(hotel.lat), lng: Number(hotel.lng) } : null,
    city: hotel.cityId
      ? {
          id: hotel.cityId,
          name: hotel.cityName,
          countryCode: hotel.countryCode,
        }
      : null,
    checkInTime: hotel.checkInTime,
    checkOutTime: hotel.checkOutTime,
    description: hotel.extra?.description || '',
    photos,
    tags,
    amenities: hotel.extra?.amenities || [],
  };
}

async function ensureHotelExists(hotelId) {
  const row = await db('hotels').select('id').where({ id: hotelId, status: 1 }).first();
  if (!row) {
    throw new HttpError(404, 'Hotel not found', 2001);
  }
  return row;
}

async function getHotelRooms(hotelId, { checkIn, checkOut }) {
  await ensureHotelExists(hotelId);
  const startDate = normalizeDate(checkIn);
  const endDate = checkOut ? normalizeDate(checkOut) : startDate;

  const rooms = await db('rooms')
    .select('id', 'name', 'area', 'bed_type as bedType', 'capacity', 'extra')
    .where({ hotel_id: hotelId, status: 1 })
    .orderBy('id', 'asc');

  if (!rooms.length) {
    return [];
  }

  const roomIds = rooms.map((room) => room.id);
  const ratePlans = await db('rate_plans')
    .select('id', 'room_id as roomId', 'name', 'meal_plan as mealPlan', 'refundable', 'currency', 'extra')
    .whereIn('room_id', roomIds)
    .andWhere('status', 1)
    .orderBy('id', 'asc');

  const ratePlanIds = ratePlans.map((plan) => plan.id);
  let pricesMap = {};
  if (ratePlanIds.length) {
    const priceRows = await db('room_price_calendar')
      .select('rate_plan_id as ratePlanId', 'stay_date as stayDate', 'price', 'inventory', 'sold', 'status')
      .whereIn('rate_plan_id', ratePlanIds)
      .andWhere('stay_date', '>=', startDate)
      .andWhere('stay_date', '<=', endDate);

    pricesMap = priceRows.reduce((acc, row) => {
      if (!acc[row.ratePlanId]) acc[row.ratePlanId] = [];
      acc[row.ratePlanId].push({
        date: row.stayDate,
        price: Number(row.price),
        inventory: row.inventory,
        sold: row.sold,
        status: row.status,
      });
      return acc;
    }, {});
  }

  const planMap = ratePlans.reduce((acc, plan) => {
    if (!acc[plan.roomId]) acc[plan.roomId] = [];
    acc[plan.roomId].push({
      id: plan.id,
      name: plan.name,
      mealPlan: plan.mealPlan,
      refundable: plan.refundable,
      currency: plan.currency,
      prices: pricesMap[plan.id] || [],
      extra: plan.extra || {},
    });
    return acc;
  }, {});

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    area: room.area ? Number(room.area) : null,
    bedType: room.bedType,
    capacity: room.capacity,
    amenities: room.extra?.amenities || [],
    plans: planMap[room.id] || [],
  }));
}

module.exports = {
  listHotels,
  getHotelById,
  getHotelRooms,
};
