var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const firebaseDB = admin.firestore();

module.exports ={
    firebaseDB
}