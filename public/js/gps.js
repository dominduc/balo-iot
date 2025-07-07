import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDw25yx74PU7XyD64kyUCSSpChKFooLRqQ",
  authDomain: "balo-iot-380bb.firebaseapp.com",
  databaseURL: "https://balo-iot-380bb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "balo-iot-380bb",
  storageBucket: "balo-iot-380bb.firebasestorage.app",
  messagingSenderId: "992989064578",
  appId: "1:992989064578:web:55b264ba30522a6293739b"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Đọc dữ liệu GPS
const gpsRef = ref(db, 'gps');
onValue(gpsRef, (snapshot) => {
  const data = snapshot.val();

  if (data && data.lat !== undefined && data.lon !== undefined) {
    // Cập nhật lên giao diện
    document.getElementById("longitude").textContent = data.lon;
    document.getElementById("latitude").textContent = data.lat;

    // Lưu vào localStorage
    localStorage.setItem("gps_lat", data.lat);
    localStorage.setItem("gps_lon", data.lon);
  } else {
    document.getElementById("longitude").textContent = "--";
    document.getElementById("latitude").textContent = "--";

    // Xóa khỏi localStorage nếu dữ liệu lỗi
    localStorage.removeItem("gps_lat");
    localStorage.removeItem("gps_lon");
  }
});
