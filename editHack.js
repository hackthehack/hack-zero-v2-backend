export const edit = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
      "Access-Control-Allow-Credentials": true
    },
    body: "edit hack route"
  };
};
