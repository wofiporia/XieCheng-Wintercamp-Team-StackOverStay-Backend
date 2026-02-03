const db = require('../config/database');

async function listBanners({ platform = 'mobile', limit = 5 } = {}) {
  const now = new Date();
  const rows = await db('banners')
    .select(
      'id',
      'title',
      'image_url as imageUrl',
      'jump_type as jumpType',
      'jump_payload as jumpPayload',
      'start_time as startTime',
      'end_time as endTime',
      'platform',
      'priority',
    )
    .where('status', 1)
    .andWhere('platform', platform)
    .andWhere('start_time', '<=', now)
    .andWhere('end_time', '>=', now)
    .orderBy('priority', 'asc')
    .orderBy('start_time', 'desc')
    .limit(Number(limit));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    platform: row.platform,
    activeRange: {
      start: row.startTime,
      end: row.endTime,
    },
    jump: {
      type: row.jumpType,
      payload: row.jumpPayload || {},
    },
  }));
}

module.exports = {
  listBanners,
};
