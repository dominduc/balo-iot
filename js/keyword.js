let keywords = JSON.parse(localStorage.getItem("keywords")) || [];
let keywordMessages = JSON.parse(localStorage.getItem("keywordMessages")) || [];

function saveKeywords() {
  localStorage.setItem("keywords", JSON.stringify(keywords));
  cleanKeywordMessages(); // Xoá các câu không còn khớp từ khóa
}

function saveKeywordMessages() {
  localStorage.setItem("keywordMessages", JSON.stringify(keywordMessages));
}

function cleanKeywordMessages() {
  const updatedMessages = keywordMessages.filter(msg =>
    keywords.some(word => msg.toLowerCase().includes(word))
  );
  keywordMessages = updatedMessages;
  saveKeywordMessages();
  renderKeywordMessages();
}

function renderKeywords() {
  const list = document.getElementById("keyword-list");
  list.innerHTML = "";
  keywords.forEach((word, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = word;

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      if (confirm(`Bạn có chắc muốn xóa từ khóa "${word}" không?`)) {
        keywords.splice(index, 1);
        saveKeywords();
        renderKeywords();
      }
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function renderKeywordMessages() {
  const container = document.getElementById("keyword-messages");
  container.innerHTML = "";
  keywordMessages.forEach(msg => {
    const p = document.createElement("p");
    p.className = "mb-2";
    p.textContent = msg;
    container.appendChild(p);
  });
}

function addKeyword() {
  const input = document.getElementById("keyword-input");
  const word = input.value.trim().toLowerCase();
  if (word && !keywords.includes(word)) {
    keywords.push(word);
    saveKeywords();
    renderKeywords();
  }
  input.value = "";
}

// Cho phép thêm bằng Enter
document.getElementById("keyword-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addKeyword();
});

// Gọi khi khởi động
renderKeywords();
renderKeywordMessages();

renderKeywords();
cleanKeywordMessages(); // <-- Gọi lại để lọc trước khi render
renderKeywordMessages();
