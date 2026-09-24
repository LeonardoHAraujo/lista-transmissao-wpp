export function unauthorizedErrorResponse() {
  return {
    statusCode: 401,
    body: JSON.stringify({ message: 'Unauthorized.' })
  };
}