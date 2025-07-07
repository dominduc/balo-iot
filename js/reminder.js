
// ====== Biến toàn cục ======
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let pendingReminder = null;

// ====== Hàm lưu và hiển thị ======
function saveReminders() {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

function appendChatMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// ====== Hàm phân tích câu lệnh nhắc nhở ======
function parseReminderCommand(text) {
  const regex = /nhắc tôi\s(.+?)(?:\s+lúc\s+)?(\d{1,2})[:h](\d{1,2})/i;
  const match = text.toLowerCase().trim().match(regex);

  if (match) {
    const message = match[1].trim();
    const hour = match[2].padStart(2, '0');
    const minute = match[3].padStart(2, '0');
    const time = `${hour}:${minute}`;
    return { message, time };
  }
  return null;
}

// ====== Xử lý tin nhắn nhắc nhở ======
function handleReminderInput(text) {
  // Trả lời xác nhận
  if (pendingReminder) {
    if (["có", "yes"].includes(text.toLowerCase())) {
      reminders.push({ ...pendingReminder, notified: false });
      saveReminders();
      appendChatMessage("🤖 Chatbot", `✅ Đã lưu lời nhắc: "${pendingReminder.message}" lúc ${pendingReminder.time}`);
    } else {
      appendChatMessage("🤖 Chatbot", `❌ Đã hủy lời nhắc.`);
    }
    pendingReminder = null;
    return true;
  }

  // Phân tích cú pháp nhắc nhở
  const parsed = parseReminderCommand(text);
  if (parsed) {
    pendingReminder = parsed;
    appendChatMessage("🤖 Chatbot", `📌 Bạn có muốn tạo lời nhắc: "${parsed.message}" lúc ${parsed.time}? (Trả lời: có / không)`);
    return true;
  }

  return false; // Không phải nhắc nhở
}

// ====== Đồng hồ kiểm tra lời nhắc mỗi phút ======
setInterval(() => {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hour}:${minute}`;

  reminders.forEach((reminder, i) => {
    if (!reminder.notified && reminder.time === currentTime) {
      appendChatMessage("⏰ Nhắc nhở", `Đến giờ rồi! Bạn cần: ${reminder.message}`);
      reminders[i].notified = true;
      saveReminders();
    }
  });
}, 1000);