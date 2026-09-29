export function internalServerErrorResponse(message: string) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message }),
  };
}
