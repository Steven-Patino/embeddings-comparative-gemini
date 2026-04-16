export function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    message: error.message || 'Error interno del servidor.',
    details: error.details || null,
  });
}
