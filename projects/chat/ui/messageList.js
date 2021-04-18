import { sanitize } from '../utils';

export default class MessageList {
  constructor(element) {
    this.element = element;
  }

  add(from, text) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const time = `${hours}:${minutes}`;
    const item = document.createElement('div');

    item.classList.add('messages');
    item.innerHTML = `
          <div class="messages__item">
          <div class="message-header">
            <div class="message__nick">${sanitize(from)}</div>
            <div class="time">${time}</div>
          </div>
            <div class="message__content">
              <img src="./photos/${from}.png" class="avatar-link" data-user="${sanitize(
      from
    )}"/>
              <div class="message__text message">${sanitize(text)}</div>
            </div>
          </div>
    `;

    this.element.append(item);
    this.element.scrollTop = this.element.scrollHeight;
  }

  addSystemMessage(message) {
    const item = document.createElement('div');

    item.classList.add('message-item', 'message-item-system');
    item.textContent = message;

    this.element.append(item);
    this.element.scrollTop = this.element.scrollHeight;
  }
}
