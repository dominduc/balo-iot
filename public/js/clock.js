function updateClock() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vietnamTime = new Date(utc + 7 * 3600000);

  const hours = vietnamTime.getHours().toString().padStart(2, "0");
  const minutes = vietnamTime.getMinutes().toString().padStart(2, "0");
  const seconds = vietnamTime.getSeconds().toString().padStart(2, "0");

  const day = vietnamTime.getDate().toString().padStart(2, "0");
  const month = (vietnamTime.getMonth() + 1).toString().padStart(2, "0");
  const year = vietnamTime.getFullYear();
  const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const weekday = weekdays[vietnamTime.getDay()];

  const formatted = `${weekday}, ${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;

  // Cập nhật cho nhiều đồng hồ nếu có
  const clockElements = document.querySelectorAll("#clock-box, #home-clock");
  clockElements.forEach(el => el.textContent = formatted);
}

setInterval(updateClock, 1000);
updateClock();


function updateTodaySchedule() {
  const vietnamTime = new Date(new Date().getTime() + 7 * 3600000);
  const dayIndex = vietnamTime.getDay(); // 0: Chủ nhật, 1: Thứ hai, ..., 6: Thứ bảy
  const keys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const key = `tkb-${keys[dayIndex]}`;
  const schedule = localStorage.getItem(key) || 'Không có lịch';
  
  const displayEl = document.getElementById('today-schedule');
  if (displayEl) displayEl.textContent = schedule;
}
updateTodaySchedule();
setInterval(updateTodaySchedule, 60 * 1000); // mỗi phút kiểm tra 1 lần
