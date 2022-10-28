const fs = require("fs");
const path = require("path");
const firebase = require("firebase/app");
const firestore = require("firebase/firestore/lite");
const { collection } = require("firebase/firestore/lite");

async function main() {
  // check input
  console.log(process.argv);
  if (process.argv.length != 5) {
    console.log("missing argument");
    return;
  }

  // load credentials
  let credential_filepath = process.argv[2];
  let credential = fs.readFileSync(credential_filepath);
  credential = JSON.parse(credential);

  // load json file
  let data_filepath = process.argv[3];
  let data = fs.readFileSync(data_filepath);
  data = JSON.parse(data);

  //
  let collection = process.argv[4];

  // init firebase
  const app = firebase.initializeApp(credential);
  const db = firestore.getFirestore(app);

  //
  for (let row of data) {
    if (!row._id) continue;

    await firestore.setDoc(firestore.doc(db, collection, row._id), row);
  }
}

//
main();
