// Đợi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  // Hàm khởi tạo bản đồ Leaflet
  function initMap() {
    const lat = parseFloat(localStorage.getItem("gps_lat"));
    const lon = parseFloat(localStorage.getItem("gps_lon"));

    if (!lat || !lon) {
      alert("Không tìm thấy tọa độ GPS trong localStorage.");
      return;
    }

    // Tạo bản đồ tại vị trí (lat, lon)
    const map = L.map("map").setView([lat, lon], 16);

    // Thêm layer bản đồ từ OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Thêm marker tại vị trí
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("📍 Vị trí hiện tại của bạn")
      .openPopup();
  }

  // Gọi initMap khi chuyển sang trang "accelerometer"
  const originalShowPage = window.showPage;
  window.showPage = function (pageId) {
    originalShowPage(pageId);
    if (pageId === "accelerometer") {
      setTimeout(initMap, 300); // Đợi giao diện render xong
    }
  };
});
