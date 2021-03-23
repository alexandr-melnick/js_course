/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами,
 цветом и позицией на экране
 
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем,
 что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу,
 то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';
const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {
  const dragDiv = e.target;
  if (dragDiv.classList.contains('draggable-div')) {
    dragDiv.onmousedown = function (e) {
      const shiftX = e.clientX - dragDiv.getBoundingClientRect().left;
      const shiftY = e.clientY - dragDiv.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        dragDiv.style.left = pageX - shiftX + 'px';
        dragDiv.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      dragDiv.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        dragDiv.onmouseup = null;
      };
    };

    dragDiv.ondragstart = function () {
      return false;
    };
  }
});

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return `rgb(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)})`;
}

export function createDiv() {
  const div = document.createElement('div');
  div.classList.add('draggable-div');
  div.draggable = true;
  div.style.width = `${getRandom(1, 200)}px`;
  div.style.height = `${getRandom(1, 200)}px`;
  div.style.backgroundColor = getRandomColor();
  div.style.left = `${getRandom(0, 1000)}px`;
  div.style.top = `${getRandom(0, 1000)}px`;
  return div;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});
