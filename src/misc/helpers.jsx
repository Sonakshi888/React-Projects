/** function to get the initials of the name */
export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

/** function to get the json data from the firebase and convert it into an array */
export function transformToArrayWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((roomId) => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}
