export function badRequestErrorResponse(error: any) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad request.',
      errors: error,
    })
  };
}