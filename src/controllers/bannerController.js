const bannerService = require('../services/bannerService');

const send = (res, data) => {
  res.json({
    code: 0,
    message: 'ok',
    data,
  });
};

exports.list = async (req, res) => {
  const data = await bannerService.listBanners({
    platform: req.query.platform,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  send(res, data);
};
