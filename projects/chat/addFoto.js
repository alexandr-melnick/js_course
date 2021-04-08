const avaBtn = document.querySelector('.avatar-link');
const addFoto = document.querySelector('.loadAva-wrap');
const close = document.querySelector('.close');

avaBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addFoto.style.display = 'flex';
});

close.addEventListener('click', (e) => {
  e.preventDefault();
  addFoto.style.display = 'none';
});

addFoto.addEventListener('click', (e) => {
  if (e.target.classList.contains('loadAva-wrap')) {
    addFoto.style.display = 'none';
  }
});
