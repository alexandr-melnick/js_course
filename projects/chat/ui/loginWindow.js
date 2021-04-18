export default class LoginWindow {
  constructor(element, onLogin) {
    this.element = element;
    this.onLogin = onLogin;

    const nickName = element.querySelector('#regNick');
    const loginBtn = element.querySelector('#login');

    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const nick = nickName.value;
      nickName.addEventListener('focus', () => {
        nickName.style.borderBottom = '1px solid #5387C1';
      });
      if (nick) {
        this.onLogin(nick);
      } else {
        nickName.style.borderBottom = '1px solid red';
      }
      const avaImg = document.querySelector('#avaImg');
      avaImg.src = `./photos/${nick}.png`;
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
