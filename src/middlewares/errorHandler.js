function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  
  // 在测试环境下，不打印 4xx 客户端错误，保持控制台整洁
  // 在生产/开发环境下，保留打印以便调试
  if (process.env.NODE_ENV !== 'test' || status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    code: err.code || (status >= 500 ? 5000 : status),
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
