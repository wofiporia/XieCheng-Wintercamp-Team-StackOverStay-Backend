exports.seed = async function (knex) {
  console.log('🌱 Starting seed...');

  // --- Helper Functions ---
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min, max, fixed = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
  
  // --- 1. Cleanup ---
  console.log('🧹 Cleaning up old data...');
  await knex('room_price_calendar').del();
  await knex('rate_plans').del();
  await knex('rooms').del();
  await knex('quick_filters').del();
  await knex('hotel_tags').del();
  await knex('tags').del();
  await knex('hotel_photos').del();
  await knex('hotels').del();
  await knex('cities').del();
  await knex('banners').del();

  // --- 2. Cities ---
  console.log('🏙️ Seeding cities...');
  const citiesData = [
    { id: 110100, name: '北京', country_code: 'CN', lat: 39.9042, lng: 116.4074 },
    { id: 310100, name: '上海', country_code: 'CN', lat: 31.2304, lng: 121.4737 },
    { id: 440100, name: '广州', country_code: 'CN', lat: 23.1291, lng: 113.2644 },
    { id: 440300, name: '深圳', country_code: 'CN', lat: 22.5431, lng: 114.0579 },
    { id: 330100, name: '杭州', country_code: 'CN', lat: 30.2741, lng: 120.1551 },
    { id: 510100, name: '成都', country_code: 'CN', lat: 30.5728, lng: 104.0668 },
    { id: 610100, name: '西安', country_code: 'CN', lat: 34.3416, lng: 108.9398 },
    { id: 420100, name: '武汉', country_code: 'CN', lat: 30.5928, lng: 114.3055 },
    { id: 320100, name: '南京', country_code: 'CN', lat: 32.0584, lng: 118.7965 },
    { id: 500000, name: '重庆', country_code: 'CN', lat: 29.5630, lng: 106.5516 },
  ];
  await knex('cities').insert(citiesData);

  // --- 3. Tags ---
  console.log('🏷️ Seeding tags...');
  const tagsData = [
    { code: 'luxury', name: '豪华型', type: 'theme' },
    { code: 'business', name: '商务出行', type: 'theme' },
    { code: 'family', name: '亲子游', type: 'theme' },
    { code: 'couple', name: '情侣约会', type: 'theme' },
    { code: 'scenic', name: '周边景色', type: 'theme' },
    { code: 'near_metro', name: '近地铁', type: 'feature' },
    { code: 'free_parking', name: '免费停车', type: 'feature' },
    { code: 'gym', name: '健身房', type: 'feature' },
    { code: 'pool', name: '游泳池', type: 'feature' },
    { code: 'breakfast', name: '含早餐', type: 'feature' },
  ];
  const createdTags = await knex('tags').insert(tagsData).returning('*');
  const tagMap = createdTags.reduce((acc, tag) => { acc[tag.code] = tag.id; return acc; }, {});

  // --- 4. Hotels & Photos & HotelTags ---
  console.log('🏨 Seeding hotels...');
  const hotelPrefixes = ['希尔顿', '万豪', '喜来登', '如家', '汉庭', '全季', '亚朵', '香格里拉', '凯悦', '洲际', 'StackOverStay', '易宿'];
  const hotelSuffixes = ['大酒店', '度假村', '精品酒店', '公寓', '客栈', '宾馆'];
  const districts = ['市中心', '高新区', '老城区', 'CBD', '大学城', '风景区'];
  const images = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ];

  const hotels = [];
  const hotelPhotos = [];
  const hotelTags = [];
  
  // Create ~50 hotels
  for (let i = 0; i < 50; i++) {
    const city = pickRandom(citiesData);
    const name = `${pickRandom(hotelPrefixes)}${pickRandom(hotelSuffixes)} (${city.name}${pickRandom(districts)}店)`;
    const starRating = randomFloat(3, 5, 1);
    // Jiggle coordinates slightly around city center
    const lat = city.lat + randomFloat(-0.05, 0.05, 4);
    const lng = city.lng + randomFloat(-0.05, 0.05, 4);
    const basePrice = randomInt(200, 2000);

    const hotel = {
      city_id: city.id,
      name,
      address: `${city.name}市${pickRandom(districts)}某街道${randomInt(1, 999)}号`,
      star_rating: starRating,
      min_price_cache: basePrice,
      lat,
      lng,
      status: 1,
      check_in_time: '14:00',
      check_out_time: '12:00',
      extra: JSON.stringify({
        description: '这是一家非常棒的酒店，设施齐全，交通便利，是您出行的不二之选。',
        quickFacts: [pickRandom(['免费停车', '近地铁']), pickRandom(['含早餐', '健身房'])],
        amenities: ['wifi', 'ac', 'tv', 'hot_water']
      })
    };
    
    // We insert one by one to get ID (or we could use returning, but knex batch insert returning support varies by DB driver version/config)
    // For simplicity with loop, let's just await insert.
    const [hotelId] = await knex('hotels').insert(hotel).returning('id');
    const actualHotelId = hotelId.id || hotelId; // handle pg return object structure

    // Add Photos
    const numPhotos = randomInt(2, 5);
    for (let j = 0; j < numPhotos; j++) {
      hotelPhotos.push({
        hotel_id: actualHotelId,
        url: pickRandom(images),
        type: j === 0 ? 'cover' : 'gallery',
        sort_order: j
      });
    }

    // Add Tags
    const numTags = randomInt(1, 4);
    const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);
    selectedTags.forEach(tag => {
      hotelTags.push({
        hotel_id: actualHotelId,
        tag_id: tag.id
      });
    });

    hotels.push({ id: actualHotelId, basePrice }); // Store for room generation
  }

  await knex('hotel_photos').insert(hotelPhotos);
  await knex('hotel_tags').insert(hotelTags);

  // --- 5. Rooms & Rate Plans & Calendar ---
  console.log('🛏️ Seeding rooms, rate plans and calendar...');
  const roomTypes = [
    { name: '标准大床房', area: 25, bed: '大床', cap: 2, priceMult: 1.0 },
    { name: '双床房', area: 30, bed: '双床', cap: 2, priceMult: 1.1 },
    { name: '豪华大床房', area: 35, bed: '特大床', cap: 2, priceMult: 1.3 },
    { name: '家庭套房', area: 50, bed: '大床+单人床', cap: 3, priceMult: 1.6 },
    { name: '行政套房', area: 60, bed: '特大床', cap: 2, priceMult: 2.0 },
  ];

  const ratePlanTypes = [
    { name: '不含早', meal: 'None', refund: true, priceMult: 1.0 },
    { name: '含双早', meal: 'Breakfast', refund: true, priceMult: 1.15 },
    { name: '特惠(不可退)', meal: 'None', refund: false, priceMult: 0.85 },
  ];

  const roomsData = [];
  const ratePlansData = [];
  const calendarData = [];

  // To avoid memory issues with huge inserts, we might batch process.
  // But 50 hotels * 3 rooms = 150 rooms. 150 * 2 plans = 300 plans. 300 * 60 days = 18000 rows.
  // 18000 rows is fine for a single batch or a few batches.

  for (const hotel of hotels) {
    const numRooms = randomInt(2, 4);
    const selectedRoomTypes = roomTypes.sort(() => 0.5 - Math.random()).slice(0, numRooms);

    for (const rt of selectedRoomTypes) {
      const [roomIdObj] = await knex('rooms').insert({
        hotel_id: hotel.id,
        name: rt.name,
        area: rt.area,
        bed_type: rt.bed,
        capacity: rt.cap,
        status: 1,
        extra: JSON.stringify({ amenities: ['wifi', 'tv'] })
      }).returning('id');
      const roomId = roomIdObj.id || roomIdObj;

      const numPlans = randomInt(1, 3);
      const selectedPlans = ratePlanTypes.sort(() => 0.5 - Math.random()).slice(0, numPlans);

      for (const pt of selectedPlans) {
        const [planIdObj] = await knex('rate_plans').insert({
          room_id: roomId,
          name: pt.name,
          meal_plan: pt.meal,
          refundable: pt.refund,
          currency: 'CNY',
          status: 1
        }).returning('id');
        const planId = planIdObj.id || planIdObj;

        // Calendar for next 60 days
        const today = new Date();
        const baseRoomPrice = hotel.basePrice * rt.priceMult * pt.priceMult;

        for (let d = 0; d < 60; d++) {
          const date = new Date(today);
          date.setDate(date.getDate() + d);
          const dateStr = date.toISOString().slice(0, 10);
          
          // Weekend price hike
          const isWeekend = date.getDay() === 5 || date.getDay() === 6;
          const finalPrice = Math.floor(baseRoomPrice * (isWeekend ? 1.2 : 1.0) + randomInt(-20, 20));

          calendarData.push({
            rate_plan_id: planId,
            stay_date: dateStr,
            price: finalPrice,
            inventory: randomInt(0, 10), // Some sold out
            sold: randomInt(0, 2),
            status: 1
          });
        }
      }
    }
  }

  // Insert calendar in chunks to be safe
  const chunkSize = 1000;
  for (let i = 0; i < calendarData.length; i += chunkSize) {
    await knex('room_price_calendar').insert(calendarData.slice(i, i + chunkSize));
  }

  // --- 6. Banners & Quick Filters ---
  console.log('🖼️ Seeding banners & filters...');
  await knex('banners').insert([
    {
      title: '春节特惠大促',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      jump_type: 'hotel_list',
      jump_payload: JSON.stringify({ cityId: 310100 }),
      start_time: new Date(),
      end_time: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      priority: 10,
      status: 1
    },
    {
      title: '周末狂欢',
      image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      jump_type: 'hotel_list',
      jump_payload: JSON.stringify({ sort: 'price_asc' }),
      start_time: new Date(),
      end_time: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      priority: 5,
      status: 1
    }
  ]);

  await knex('quick_filters').insert([
    {
      tag_id: tagMap['business'],
      label: '商务出行',
      priority: 10,
      status: 1
    },
    {
      tag_id: tagMap['family'],
      label: '亲子游',
      priority: 9,
      status: 1
    },
    {
      tag_id: tagMap['near_metro'],
      label: '近地铁',
      priority: 8,
      status: 1
    },
    {
      tag_id: tagMap['luxury'],
      label: '豪华酒店',
      priority: 7,
      status: 1
    }
  ]);

  console.log('✅ Seed completed!');
};
