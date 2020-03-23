export const pickIfTruthy = (originalData, ...fields) => {
  return fields.reduce((newObject, field) => {
    if (originalData[field]) {
      newObject[field] = originalData[field];
    }
    return newObject;
  }, {});
};
