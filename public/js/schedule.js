const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Load dữ liệu từ localStorage
function loadSchedule() {
  days.forEach(day => {
    const input = document.getElementById(day);
    const saved = localStorage.getItem(`tkb-${day}`);
    if (saved) input.value = saved;
  });
}

// Lưu khi người dùng thay đổi input
function setupScheduleListeners() {
  days.forEach(day => {
    const input = document.getElementById(day);
    input.addEventListener('input', () => {
      localStorage.setItem(`tkb-${day}`, input.value);
    });
  });
}

// Clear input khi bấm nút xóa
function clearInput(button) {
  const input = button.closest('.d-flex').querySelector('input');
  input.value = "";
  const id = input.id;
  if (id) localStorage.removeItem(`tkb-${id}`);
}

// Khởi động
window.addEventListener('DOMContentLoaded', () => {
  loadSchedule();
  setupScheduleListeners();
});
