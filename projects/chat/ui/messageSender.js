export default class MessageSender {
  constructor(element, onSend) {
    this.onSend = onSend;
    this.messageInput = element.querySelector('#inputMessage');
    this.messageSendButton = element.querySelector('#sendMessage');

    this.messageSendButton.addEventListener('click', () => {
      const message = this.messageInput.value;

      if (message) {
        this.onSend(message);
      }
    });
  }

  clear() {
    this.messageInput.value = '';
  }
}
