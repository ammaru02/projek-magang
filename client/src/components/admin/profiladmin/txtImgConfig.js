// txtImgConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsXq7s8SPKNZKyLN4V7Xvyl9iQqFpXI9Y",
  authDomain: "txtimage-96fd4.firebaseapp.com",
  projectId: "txtimage-96fd4",
  storageBucket: "txtimage-96fd4.appspot.com",
  messagingSenderId: "1079583934848",
  appId: "1:1079583934848:web:73afc20499f1fd7d315965"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };