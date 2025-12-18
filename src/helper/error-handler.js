import boom from '@hapi/boom';

export const ErrorHandler = (err, c) => {
  const boomError = boom.boomify(err);
  return c.json(
    {
      message: boomError.message,
      statusCode: boomError.output.statusCode,
    },
    boomError.output.statusCode
  );
};
