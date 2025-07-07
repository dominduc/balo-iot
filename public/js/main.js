window.onload = function () {
  // TKB
  loadSchedule();
  setupScheduleListeners(); // thêm dòng này

  // Dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
};
