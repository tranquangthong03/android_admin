import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtOMJ0IG-lO6GwgDrFPLeTz9rK5cHM0ew",
  authDomain: "myandroidapp-f077b.firebaseapp.com",
  projectId: "myandroidapp-f077b",
  storageBucket: "myandroidapp-f077b.firebasestorage.app",
  messagingSenderId: "145111207914",
  appId: "1:145111207914:web:e789d0b04471572c046c93",
  measurementId: "G-E11BYXMG4H"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các dịch vụ để sử dụng
export const db = getFirestore(app);
export const auth = getAuth(app);