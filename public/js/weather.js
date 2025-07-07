// weather.js
const apiKey = "469304e84d4a22c219dc4345b5aac35c";
const city = "Phu Tho"; // ← Chỉ cần đổi tên ở đây nếu muốn xem thành phố khác

async function fetchWeatherData() {
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    
    if (!weatherRes.ok) throw new Error("Không thể lấy dữ liệu thời tiết");

    const weatherData = await weatherRes.json();

    // Kiểm tra dữ liệu cần thiết
    if (!weatherData.coord || !weatherData.main) throw new Error("Dữ liệu thời tiết không hợp lệ");

    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;

    // Hiển thị thời tiết
    document.getElementById("city").textContent = weatherData.name || city;
    document.getElementById("temp").textContent = `${weatherData.main.temp.toFixed(1)}°C`;
    document.getElementById("humidity").textContent = `${weatherData.main.humidity}%`;

    // Gợi ý dựa theo nhiệt độ
    const temp = weatherData.main.temp;
    let suggestion = "";
    if (temp < 18) {
      suggestion = "Trời lạnh, nên mang áo khoác ấm";
    } else if (temp < 26) {
      suggestion = "Thời tiết dễ chịu, có thể mặc đồ thoải mái";
    } else {
      suggestion = "Nóng, nên mặc nhẹ và uống đủ nước";
    }
    document.getElementById("suggestion").textContent = suggestion;

    // Lấy chỉ số AQI
    const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    
    if (!aqiRes.ok) throw new Error("Không thể lấy dữ liệu chất lượng không khí");

    const aqiData = await aqiRes.json();
    const aqi = aqiData.list?.[0]?.main?.aqi || 0;

    const aqiLevels = ["", "Tốt", "Trung bình", "Kém", "Có hại", "Nguy hiểm"];
    document.getElementById("aqi").textContent = `${aqi} (${aqiLevels[aqi] || "Không xác định"})`;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    document.getElementById("city").textContent = "Lỗi dữ liệu";
    document.getElementById("temp").textContent = "--";
    document.getElementById("humidity").textContent = "--";
    document.getElementById("aqi").textContent = "--";
    document.getElementById("suggestion").textContent = "Không thể gợi ý";
  }
}

// Gọi ngay và tự động cập nhật mỗi 10 phút
fetchWeatherData();
setInterval(fetchWeatherData, 10 * 60 * 1000); // 10 phút
