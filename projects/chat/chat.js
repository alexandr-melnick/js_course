import ChatWindow from './ui/chatWindow';
import LoginWindow from './ui/loginWindow';
import UserName from './ui/userName';
import UserList from './ui/userList';
import UserPhoto from './ui/userPhoto';
import MessageList from './ui/messageList';
import MessageSender from './ui/messageSender';
import WSClient from './wsClient';

export default class chat {
  constructor() {
    this.wsClient = new WSClient(`ws://localhost:8282/`, this.onMessage.bind(this));

    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#regForm'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(document.querySelector('#main')),
      userName: new UserName(document.querySelector('#user-name')),
      userList: new UserList(document.querySelector('.members__list')),
      messageList: new MessageList(document.querySelector('.messages')),
      messageSender: new MessageSender(
        document.querySelector('.form'),
        this.onSend.bind(this)
      ),
      userPhoto: new UserPhoto(
        document.querySelector('.avatar-link'),
        this.onUpload.bind(this)
      ),
    };

    this.ui.loginWindow.show();
  }

  onUpload(data) {
    this.ui.userPhoto.set(data);

    fetch('/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.ui.userName.get(),
        image: data,
      }),
    });
  }

  async onLogin(name) {
    await this.wsClient.connect();
    this.wsClient.sendHello(name);
    this.ui.loginWindow.hide();
    this.ui.chatWindow.show();
    this.ui.userName.set(name);
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.ui.messageSender.clear();
  }

  onMessage({ type, from, data }) {
    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageList.addSystemMessage(`${from} вошел в чат`);
    } else if (type === 'user-list') {
      for (const item of data) {
        this.ui.userList.add(item);
      }
    } else if (type === 'bye-bye') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
    } else if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    } else if (type === 'photo-changed') {
      const qwe = document.querySelector(`[data-user=${data?.name}]`);
      if (!qwe) return;
      const qweParent = qwe.parentNode;
      qweParent.removeChild(qwe);
      const img = document.createElement('img');
      img.src = `./photos/${data?.name}.png`;
      img.classList.add('avatar-link');
      img.setAttribute('data-user', `${data?.name}`);
      qweParent.insertBefore(img, qweParent.firstChild);
    }
  }
}
