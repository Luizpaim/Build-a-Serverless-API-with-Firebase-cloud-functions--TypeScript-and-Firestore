import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";

admin.initializeApp();

const db = admin.firestore();

export { admin, db };
