export default class AddUserPhoto {
  add(element, data) {
    const elementParent = element.parentNode;
    elementParent.removeChild(element);
    const img = document.createElement('img');
    img.src = `./photos/${data?.name}.png`;
    img.classList.add('avatar-link');
    img.setAttribute('data-user', `${data?.name}`);
    elementParent.insertBefore(img, elementParent.firstChild);
  }
}
