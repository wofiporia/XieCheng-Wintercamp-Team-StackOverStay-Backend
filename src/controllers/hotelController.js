const hotelService = require('../services/hotelService');
const HttpError = require('../utils/httpError');

const send = (res, data, meta) => {
  res.json({
    code: 0,
    message: 'ok',
    data,
    meta,
  });
};

exports.list = async (req, res) => {
  const result = await hotelService.listHotels(req.query);
  send(res, result.data, result.meta);
};

exports.getById = async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  if (Number.isNaN(hotelId)) {
    throw new HttpError(400, 'Invalid hotel id', 1001);
  }
  const hotel = await hotelService.getHotelById(hotelId);
  send(res, hotel);
};

exports.getRooms = async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  if (Number.isNaN(hotelId)) {
    throw new HttpError(400, 'Invalid hotel id', 1001);
  }
  if (!req.query.checkIn) {
    throw new HttpError(400, 'checkIn is required', 1001);
  }
  const rooms = await hotelService.getHotelRooms(hotelId, {
    checkIn: req.query.checkIn,
    checkOut: req.query.checkOut,
  });
  send(res, rooms);
};
