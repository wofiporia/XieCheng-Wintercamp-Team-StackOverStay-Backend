const metaService = require('../services/metaService');
const HttpError = require('../utils/httpError');

const send = (res, data, meta) => {
  res.json({
    code: 0,
    message: 'ok',
    data,
    meta: meta || undefined,
  });
};

exports.getCities = async (req, res) => {
  const data = await metaService.getCities({
    keyword: req.query.keyword,
    country: req.query.country,
  });
  send(res, data);
};

exports.getQuickFilters = async (req, res) => {
  const data = await metaService.getQuickFilters({
    platform: req.query.platform,
  });
  send(res, data);
};

exports.getHotelFilters = (req, res) => {
  send(res, metaService.getHotelFilters());
};

exports.reverseGeocode = async (req, res) => {
  const { lat, lng } = req.query;
  if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    throw new HttpError(400, 'lat and lng are required', 1001);
  }
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new HttpError(400, 'lat and lng must be numbers', 1001);
  }

  const city = await metaService.reverseGeocode(latitude, longitude);
  if (!city) {
    throw new HttpError(404, 'No nearby city found', 2001);
  }
  send(res, city);
};
