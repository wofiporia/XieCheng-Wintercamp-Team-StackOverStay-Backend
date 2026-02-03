const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🚀 开始全量 API 接口测试...\n');

  try {
    // 1. Health Check
    console.log('1️⃣  [基础] 健康检查 (GET /health)...');
    const health = await request('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Result:`, health.body);
    console.log('--------------------------------------------------\n');

    // 2. Banners
    console.log('2️⃣  [Banner] 获取 Banner (GET /banners)...');
    const banners = await request('/banners');
    console.log(`   Status: ${banners.status}`);
    console.log(`   Result: 找到 ${banners.body.data?.length || 0} 个 Banner`);
    if (banners.body.data?.length > 0) {
      console.log(`   示例: ${banners.body.data[0].title} (Jump: ${banners.body.data[0].jump?.type})`);
    }
    console.log('--------------------------------------------------\n');

    // 3. Meta - Cities
    console.log('3️⃣  [Meta] 获取城市列表 (GET /meta/cities)...');
    const cities = await request('/meta/cities');
    console.log(`   Status: ${cities.status}`);
    console.log(`   Result: 找到 ${cities.body.data?.length || 0} 个城市`);
    let cityId = 310100; // 默认上海
    if (cities.body.data?.length > 0) {
      const city = cities.body.data[0];
      cityId = city.id;
      console.log(`   示例: ${city.name} (ID: ${city.id})`);
    }
    console.log('--------------------------------------------------\n');

    // 4. Meta - Quick Filters
    console.log('4️⃣  [Meta] 获取快捷筛选 (GET /meta/quick-filters)...');
    const quickFilters = await request('/meta/quick-filters');
    console.log(`   Status: ${quickFilters.status}`);
    console.log(`   Result: 找到 ${quickFilters.body.data?.length || 0} 个快捷筛选`);
    if (quickFilters.body.data?.length > 0) {
      console.log(`   示例: ${quickFilters.body.data[0].label}`);
    }
    console.log('--------------------------------------------------\n');

    // 5. Meta - Hotel Filters
    console.log('5️⃣  [Meta] 获取酒店筛选条件 (GET /meta/hotel-filters)...');
    const hotelFilters = await request('/meta/hotel-filters');
    console.log(`   Status: ${hotelFilters.status}`);
    console.log(`   Result: ${Object.keys(hotelFilters.body.data || {}).join(', ')}`);
    console.log('--------------------------------------------------\n');

    // 6. Search Hotels
    console.log(`6️⃣  [Hotel] 搜索酒店 (GET /hotels?cityId=${cityId})...`);
    const hotels = await request(`/hotels?cityId=${cityId}`);
    console.log(`   Status: ${hotels.status}`);
    console.log(`   Result: 找到 ${hotels.body.data?.length || 0} 家酒店`);
    
    if (hotels.body.data?.length > 0) {
      const firstHotel = hotels.body.data[0];
      console.log(`   示例酒店: ${firstHotel.name} (ID: ${firstHotel.id})`);
      console.log(`   价格: ¥${firstHotel.minPrice}`);
      
      // 7. Hotel Details
      console.log(`\n7️⃣  [Hotel] 获取酒店详情 (GET /hotels/${firstHotel.id})...`);
      const detail = await request(`/hotels/${firstHotel.id}`);
      console.log(`   Status: ${detail.status}`);
      console.log(`   地址: ${detail.body.data?.address}`);
      console.log(`   设施: ${detail.body.data?.amenities?.join(', ')}`);

      // 8. Hotel Rooms
      console.log(`\n8️⃣  [Hotel] 获取酒店房型 (GET /hotels/${firstHotel.id}/rooms)...`);
      // 使用明天和后天的日期
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const afterTomorrow = new Date(today); afterTomorrow.setDate(today.getDate() + 2);
      const checkIn = tomorrow.toISOString().split('T')[0];
      const checkOut = afterTomorrow.toISOString().split('T')[0];
      
      console.log(`   日期: ${checkIn} - ${checkOut}`);
      const rooms = await request(`/hotels/${firstHotel.id}/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
      console.log(`   Status: ${rooms.status}`);
      console.log(`   Result: 找到 ${rooms.body.data?.length || 0} 个房型`);
      if (rooms.body.data?.length > 0) {
        console.log(`   示例房型: ${rooms.body.data[0].name} (Plan count: ${rooms.body.data[0].plans?.length})`);
      }
    }

    console.log('\n✅ 所有接口测试完成!');
  } catch (err) {
    console.error('❌ 测试失败:', err.message);
    console.log('请确保后端服务已启动 (npm run dev)');
  }
}

runTests();
