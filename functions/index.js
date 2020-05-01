const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.leaveBoard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated');
  }

  if (!data.boardId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing "boardId" argument');
  }

  const boardInfoReference = admin.firestore().collection('boards-info').doc(data.boardId);
  const boardInfoSnapshot = await boardInfoReference.get();

  if (!boardInfoSnapshot.exists) {
    throw new functions.https.HttpsError('not-found', 'Board not found');
  }

  const boardInfoData = boardInfoSnapshot.data();

  if (boardInfoData.admin === context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'User is board owner');
  }

  await boardInfoReference.update({
    admins: admin.firestore.FieldValue.arrayRemove(context.auth.uid),
    members: admin.firestore.FieldValue.arrayRemove(context.auth.uid),
  });
});
