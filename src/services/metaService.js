const db = require('../config/database');

const DEFAULT_PLATFORM = 'mobile';

async function getCities({ keyword, country }) {
  const query = db('cities')
    .select('id', 'name', 'country_code as countryCode', 'lat', 'lng', 'timezone')
    .where('status', 1)
    .orderBy('name', 'asc')
    .limit(100);

  if (keyword) {
    query.where((qb) => {
      qb.whereILike('name', `%${keyword}%`);
    });
  }

  if (country) {
    query.andWhere('country_code', country.toUpperCase());
  }

  return query;
}

async function reverseGeocode(lat, lng) {
  const row = await db('cities')
    .select('id', 'name', 'country_code as countryCode', 'lat', 'lng', 'timezone')
    .where('status', 1)
    .orderByRaw('(power(lat - ?, 2) + power(lng - ?, 2)) asc', [lat, lng])
    .first();
  return row;
}

async function getQuickFilters({ platform }) {
  const rows = await db('quick_filters as qf')
    .leftJoin('tags as t', 'qf.tag_id', 't.id')
    .select(
      'qf.id',
      'qf.label',
      'qf.jump_type as jumpType',
      'qf.jump_payload as jumpPayload',
      'qf.platform',
      'qf.priority',
      't.code as tagCode',
      't.name as tagName',
    )
    .where('qf.status', 1)
    .modify((qb) => {
      qb.andWhere('qf.platform', platform || DEFAULT_PLATFORM);
    })
    .orderBy('qf.priority', 'asc')
    .orderBy('qf.id', 'asc');

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    platform: row.platform,
    priority: row.priority,
    tag: row.tagCode
      ? {
          code: row.tagCode,
          name: row.tagName,
        }
      : null,
    jump: {
      type: row.jumpType,
      payload: row.jumpPayload || {},
    },
  }));
}

function getHotelFilters() {
  return {
    starLevels: [
      { label: '不限', value: null },
      { label: '3 星及以上', min: 3 },
      { label: '4 星及以上', min: 4 },
      { label: '5 星 / 豪华', min: 5 },
    ],
    priceRanges: [
      { label: '¥0 - ¥300', min: 0, max: 300 },
      { label: '¥300 - ¥600', min: 300, max: 600 },
      { label: '¥600 以上', min: 600, max: null },
    ],
    sortOptions: [
      { label: '价格 ↑', value: 'price_asc' },
      { label: '价格 ↓', value: 'price_desc' },
      { label: '星级 ↓', value: 'star_desc' },
    ],
  };
}

module.exports = {
  getCities,
  reverseGeocode,
  getQuickFilters,
  getHotelFilters,
};
