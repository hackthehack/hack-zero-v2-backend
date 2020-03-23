exports.pickIfTruthy = (originalData, ...fields) =>
  fields.reduce((newObject, field) => {
    if (originalData[field]) {
      newObject[field] = originalData[field];
    }
    return newObject;
  }, {});
