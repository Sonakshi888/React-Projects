/** function to get the initials of the name */
export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

/** function to get the json data from firebase and convert it into an array */
export function transformToArray(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}
/** function to get the json data from the firebase and convert it into an array with the help of an id*/
export function transformToArrayWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((roomId) => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}
/** function to update name and avatar of user at all the needed places at once using promises */
export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};

  // updating the profile
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  // in order to update the name and profile avatar we need to first get the msgs and rooms object from database
  const getMsgs = db
    .ref("/messages")
    .orderByChild("author/uid")
    .equalTo(userId)
    .once("value");

  const getRooms = db
    .ref("/rooms")
    .orderByChild("lastMessage/author/uid")
    .equalTo(userId)
    .once("value");

  const [mSnap, rSnap] = await Promise.all([getMsgs, getRooms]); //getting snapshot of  msgs and rooms objects

  //updating msg object at last
  mSnap.forEach((msgSnap) => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  //updating rooms object at last
  rSnap.forEach((roomSnap) => {
    updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });
  return updates;
}
