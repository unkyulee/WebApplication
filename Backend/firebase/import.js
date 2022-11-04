const fs = require("fs");
const path = require("path");
const firebase = require("firebase/app");
const firestore = require("firebase/firestore/lite");

async function main() {
  // check input
  console.log(process.argv);
  if (process.argv.length != 5) {
    console.error("missing argument");
    console.error(process.argv);
    return;
  }

  // load credentials
  let credential_filepath = process.argv[2];
  let credential;
  console.log(`Loading firebase credential from ${credential_filepath}`);
  try {
    credential = fs.readFileSync(credential_filepath);
    credential = JSON.parse(credential);
  } catch (ex) {
    console.error(ex);
    return;
  }

  // setup collection name
  let collection = process.argv[3];
  console.log(`Importing to collection - ${collection}`);

  // from folder
  let folder = process.argv[4];
  console.log(`Loading data from - ${folder}`);

  let files;
  try {
    files = fs.readdirSync(folder);
  } catch (ex) {
    console.error(ex);
    return;
  }

  // loop through each files
  for (let file of files) {
    let data;
    try {
      data = fs.readFileSync(path.join(folder, file)).toString();
      if (!data) {
        console.log(`Empty file ${folder} ${file}`);
        continue;
      }
      data = JSON.parse(data);
    } catch (ex) {
      console.error(ex);
      console.error(folder, file, data);
      continue;
    }

    // init firebase
    const app = firebase.initializeApp(credential);
    const db = firestore.getFirestore(app);

    //
    if (data._id) {
      await firestore.setDoc(firestore.doc(db, collection, data._id), data);
    }

    console.log(`${file} imported`);
  }
}

//
main();
