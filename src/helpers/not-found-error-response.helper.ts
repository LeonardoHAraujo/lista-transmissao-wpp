export function notFoundErrorResponse(message: string) {
  return {
    statusCode: 404,
    body: JSON.stringify({ message })
  };
}