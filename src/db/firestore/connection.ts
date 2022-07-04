import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

var serviceAccount = require("./firebase_private_key/oauth2-c28ca-firebase-adminsdk-alegi-341ce7fce0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = getFirestore();
export const initializeOIDCModel = async () => {
  const listDocument = await db.collection('oidcmodel').listDocuments();
  if (listDocument.length === 0) {
    await db.collection('oidcmodel').doc('This_collection_must_have_just_one_document').set({

    });
  }
}

