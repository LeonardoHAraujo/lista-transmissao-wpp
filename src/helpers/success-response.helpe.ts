export function successResponse() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Sent notification.' })
  };
}