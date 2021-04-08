const btn = document.querySelector('.reg__submit');
const regNickname = document.querySelector('.reg__nickname');
const regForm = document.querySelector('.reg');
const members = document.querySelector('.members');
const chat = document.querySelector('.chat');
const nickname = document.querySelector('.member__name');
const nicknameChat = document.querySelector('.messages__nick');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  regForm.style.display = 'none';
  members.style.display = 'flex';
  chat.style.display = 'flex';
  nickname.textContent = regNickname.value;
  nicknameChat.textContent = regNickname.value;
});
