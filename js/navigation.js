function showPage(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const navMap = { home: 0, functions: 1, settings: 2 };
  if (navMap[id] !== undefined) {
    document.querySelectorAll('.nav-link')[navMap[id]].classList.add('active');
  }
}