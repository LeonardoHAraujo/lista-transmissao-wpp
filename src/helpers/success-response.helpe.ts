export function successResponse(message = 'Sent notification.') {
  return {
    statusCode: 200,
    body: JSON.stringify({ message })
  };
}