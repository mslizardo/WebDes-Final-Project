const STORAGE_KEY = 'contactMessages';

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function renderMessages() {
  const list = document.getElementById('recentMessages');
  if (!list) return;

  const messages = loadMessages().slice(0, 4);

  if (messages.length === 0) {
    list.innerHTML = '<li class="text-muted">No messages yet.</li>';
    return;
  }

  list.innerHTML = messages
    .map((message) => `
      <li class="border-bottom py-2">
        <div class="fw-bold">${message.name}</div>
        <div class="small text-muted">${message.topic} • ${message.email}</div>
        <div class="mt-1">${message.message}</div>
      </li>
    `)
    .join('');
}

function showMessage(text, type) {
  const box = document.getElementById('formMessage');
  if (!box) return;

  box.className = `alert mt-3 alert-${type}`;
  box.textContent = text;
  box.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  renderMessages();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const topic = document.getElementById('topic').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !topic || !message) {
      showMessage('Please fill out all fields before sending your message.', 'danger');
      return;
    }

    const newMessage = {
      name,
      email,
      topic,
      message,
      createdAt: new Date().toLocaleString()
    };

    const messages = [newMessage, ...loadMessages()].slice(0, 8);
    saveMessages(messages);
    renderMessages();

    form.reset();
    showMessage('Your message has been sent successfully!', 'success');
  });
});
