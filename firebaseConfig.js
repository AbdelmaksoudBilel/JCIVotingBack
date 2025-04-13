var admin = require("firebase-admin");

var serviceAccount = require("./jcivoting-firebase-adminsdk-fbsvc-c723c00d40.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jcivoting-default-rtdb.firebaseio.com"
});

const db = admin.database();
module.exports = db;