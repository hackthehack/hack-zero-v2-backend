export const add = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `You have hit the create hack endpoint`
    })
  };
};
