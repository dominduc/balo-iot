// === assistant.js ===
let reminders = JSON.parse(localStorage.getItem('reminders')) || []; // Lấy danh sách lời nhắc từ localStorage, nếu chưa có thì tạo mảng rỗng
let pendingReminder = null;                                          // Biến tạm để lưu lời nhắc đang chờ người dùng xác nhận

function updateReminderSummary() {                                   // Cập nhật số lượng lời nhắc chưa được thông báo trên giao diện
  const summaryBtn = document.getElementById("reminder-summary");
  const badge = document.getElementById("reminder-badge");
  const count = reminders.filter(r => !r.notified).length;           // Đếm số lời nhắc chưa được báo

  if (summaryBtn) summaryBtn.innerText = `📋 Lời nhắc nhở: ${count}`;// Hiển thị số lượng trong nút
  // Hiển thị/hay ẩn badge tuỳ theo số lượng lời nhắc
  if (badge) {
    if (count > 0) {
      badge.innerText = `(${count})`;
      badge.classList.remove("d-none");
    } else {
      badge.classList.add("d-none");
    }
  }
}
// Hiện badge nhỏ báo hiệu có lời nhắc đến giờ
function showReminderBadge() {
  const badge = document.getElementById("reminder-alert");
  if (badge) badge.classList.remove("d-none");
}
// Ẩn badge nhỏ
function hideReminderBadge() {
  const badge = document.getElementById("reminder-alert");
  if (badge) badge.classList.add("d-none");
}

function saveReminders() {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}
// Thêm tin nhắn vào khung chat
function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = `${text}`;
  box.appendChild(div);
  setTimeout(() => div.classList.add("show"), 10);                  // Thêm hiệu ứng xuất hiện
  box.scrollTop = box.scrollHeight;                                 // Cuộn xuống dòng cuối cùng

  // === LƯU KEYWORD TỨC THÌ ===                                    // === Nếu người gửi là user thì kiểm tra từ khoá và lưu lại nếu trùng ===
  if (sender === 'user') {
    const keywords = JSON.parse(localStorage.getItem("keywords")) || [];
    const keywordMessages = JSON.parse(localStorage.getItem("keywordMessages")) || [];
// Nếu tin nhắn chứa bất kỳ từ khoá nào đã lưu
    if (keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
      keywordMessages.push(text);
      localStorage.setItem("keywordMessages", JSON.stringify(keywordMessages));

// Nếu đang hiển thị phần chứa các đoạn có từ khoá → cập nhật luôn
      const section = document.getElementById("keyword-section");
      if (section && section.style.display !== "none") {
        try {
          renderKeywordMessages();
        } catch (e) {
          console.warn("⚠️ renderKeywordMessages chưa sẵn sàng:", e);
        }
      }
    }
  }
}
// Phân tích cú pháp "nhắc tôi [nội dung] lúc [giờ]"
function parseReminderCommand(text) {
  const regex = /nhắc tôi\s(.+?)(?:\s+lúc\s+)?(\d{1,2})[:h](\d{1,2})/i;
  const match = text.toLowerCase().trim().match(regex);
  if (match) {
    const message = match[1].trim();
    const hour = match[2].padStart(2, '0');
    const minute = match[3].padStart(2, '0');
    return { message, time: `${hour}:${minute}` };
  }
  return null;
}
// Hàm gửi tin nhắn đi và xử lý logic liên quan
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;
// Hiển thị tin nhắn của người dùng
  appendMessage("user", message);
  input.value = "";
// Nếu đang có lời nhắc chờ xác nhận từ user
  if (pendingReminder) {
    const confirm = ["có", "yes", "ok", "đồng ý"].includes(message.toLowerCase());
    if (confirm) {                                               // Nếu đồng ý → thêm lời nhắc vào danh sách
      reminders.push({ ...pendingReminder, notified: false });
      saveReminders();
      updateReminderSummary();
      appendMessage("bot", `✅ Đã lưu lời nhắc: "${pendingReminder.message}" vào lúc ${pendingReminder.time}`);
    } else {                                                     // Nếu không đồng ý → hủy
      appendMessage("bot", `❌ Đã hủy lời nhắc.`);
    }
    pendingReminder = null;
    return;
  }
// Nếu tin nhắn có định dạng "nhắc tôi ..."
  const parsed = parseReminderCommand(message);
  if (parsed) {
    pendingReminder = parsed;
    appendMessage("bot", `📌 Bạn có muốn tạo lời nhắc: "${parsed.message}" lúc ${parsed.time}? (Trả lời: có / không)`);
    return;
  }
// Nếu không phải nhắc giờ → gửi API để nhận phản hồi từ bot
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Lỗi server: " + res.status);
    const data = await res.json();
    appendMessage("bot", data.reply || "Không có phản hồi.");
  } catch (err) {
    console.error("Fetch error:", err);
    appendMessage("bot", "❌ Bot gặp lỗi khi phản hồi.");
  }
}
// Gửi tin nhắn khi nhấn Enter
document.getElementById("user-input").addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
// Vòng lặp kiểm tra lời nhắc mỗi giây
setInterval(() => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  reminders.forEach((reminder, index) => {
    if (!reminder.notified && reminder.time === currentTime) {     // Đúng giờ nhắc → gửi tin nhắn thông báo
      appendMessage("bot", `⏰ Đến giờ rồi! Bạn cần: ${reminder.message}`);
      showReminderBadge();
      reminders[index].notified = true;
      saveReminders();
      updateReminderSummary();
    }
  });
}, 1000);
// Mở giao diện Assistant, đồng thời ẩn thông báo badge nhỏ
function openAssistant() {
  hideReminderBadge();
  showPage("assistant");
}
// Hiện/ẩn popup danh sách lời nhắc
function toggleReminderPopup() {
  const popup = document.getElementById("reminder-popup");
  if (!popup) return;
  popup.classList.toggle("d-none");
  if (!popup.classList.contains("d-none")) loadReminderList();    // Nếu popup được mở thì nạp danh sách lời nhắc
}
// Tải danh sách lời nhắc chưa được thông báo để hiển thị trong popup
function loadReminderList() {
  const list = document.getElementById("reminder-items");
  if (!list) return;
  list.innerHTML = "";
  reminders.forEach((r, i) => {
    if (!r.notified) {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `<span>⏰ ${r.time} - ${r.message}</span><button class=\"btn btn-sm btn-danger\" onclick=\"removeReminder(${i})\">X</button>`;
      list.appendChild(li);
    }
  });
}
// Xóa 1 lời nhắc theo chỉ số
function removeReminder(index) {
  reminders.splice(index, 1);
  saveReminders();
  updateReminderSummary();
  loadReminderList();
}
// Cập nhật giao diện tổng số lời nhắc lúc bắt đầu
updateReminderSummary();
