function showKeyword() {
  document.getElementById('keyword-section').style.display = 'block';
  document.getElementById('storage-section').style.display = 'none';
  renderKeywordMessages(); // ✅ GỌI HÀM HIỂN THỊ CÂU CHAT
}

function showStorage() {
  document.getElementById('keyword-section').style.display = 'none';
  document.getElementById('storage-section').style.display = 'block';
}

function verifyPassword() {
  const input = document.getElementById('storage-password').value;
  if (input === '1234') {
    document.getElementById('password-area').style.display = 'none';
    document.getElementById('note-area').style.display = 'block';
    loadStorage();
  } else {
    document.getElementById('password-error').innerText = 'Sai mật khẩu!';
  }
}

function saveNote() {
  const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
  const text = document.getElementById('note-input').value.trim();
  if (text) {
    notes.push({ type: 'text', content: text });
    localStorage.setItem('userNotes', JSON.stringify(notes));
    document.getElementById('note-input').value = '';
    loadStorage();
  }
}

function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const notes = JSON.parse(localStorage.getItem('userNotes')) || [];
    notes.push({ type: 'image', content: e.target.result });
    localStorage.setItem('userNotes', JSON.stringify(notes));
    loadStorage();
  };
  reader.readAsDataURL(file);
}

function loadStorage() {
  const container = document.getElementById('note-list');
  container.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('userNotes')) || [];

  notes.forEach((note, index) => {
    const item = document.createElement('div');
    item.className = 'note-item d-flex justify-content-between align-items-center';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'flex-grow-1 me-2';

    if (note.type === 'text') {
      contentWrapper.textContent = note.content;
    } else if (note.type === 'image') {
      const img = document.createElement('img');
      img.src = note.content;
      img.className = 'note-img';
      contentWrapper.appendChild(img);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.innerText = '🗑️';
    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      localStorage.setItem('userNotes', JSON.stringify(notes));
      loadStorage();
    };

    item.appendChild(contentWrapper);
    item.appendChild(deleteBtn);
    container.appendChild(item);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// ✅ THÊM MỚI: HIỂN THỊ CÁC CÂU CHAT CHỨA TỪ KHÓA
function renderKeywordMessages() {
  const container = document.getElementById("keyword-messages");
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem("keywordMessages")) || [];
  container.innerHTML = "";

  if (messages.length === 0) {
    container.innerHTML = "<em>Không có đoạn chat nào chứa từ khóa.</em>";
    return;
  }

  messages.forEach(msg => {
    const p = document.createElement("p");
    p.textContent = "🗨️ " + msg;
    container.appendChild(p);
  });
}
