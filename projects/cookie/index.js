/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('input', function () {
  const cookieParse = parseCookie();
  const filterValue = filterNameInput.value;
  listTable.innerHTML = '';
  filterCookie(cookieParse, isMatching, filterValue);
});

addButton.addEventListener('click', () => {
  document.cookie = `${addNameInput.value}=${addValueInput.value}`;
  listTable.innerHTML = '';

  if (filterNameInput.value === '') {
    const cookie = parseCookie();
    renderCookie(cookie);
  } else {
    const filtercookie = parseFilterCookie(filterNameInput.value);
    renderCookie(filtercookie);
  }
});
/////////////////////////////////////////////////////////////
function isMatching(full, str) {
  return full.toLowerCase().indexOf(str.toLowerCase()) > -1;
}

function parseCookie() {
  const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
  }, {});
  return cookie;
}

function parseFilterCookie(filterValue) {
  const cookie = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    if (isMatching(name, filterValue) || isMatching(value, filterValue)) {
      prev[name] = value;
    }
    return prev;
  }, {});
  return cookie;
}

function renderCookie(cookie) {
  const fragment = document.createDocumentFragment();
  for (const key in cookie) {
    if (key) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = key;
      const cell2 = document.createElement('td');
      cell2.textContent = cookie[key];
      const cell3 = document.createElement('td');
      const button = document.createElement('button');
      button.textContent = 'Удалить';
      cell3.appendChild(button);
      button.addEventListener('click', function () {
        listTable.removeChild(row);
        document.cookie = key + '=;expires=Thu, 01 Jan 2021 00:00:01 GMT;';
      });
      row.appendChild(cell);
      row.appendChild(cell2);
      row.appendChild(cell3);
      fragment.appendChild(row);
    }
  }
  listTable.appendChild(fragment);
}

function filterCookie(cookieParse, isMatching, filterValue) {
  const cookies = {};
  for (const key in cookieParse) {
    if (typeof key != 'undefined' && typeof cookieParse[key] != 'undefined') {
      if (isMatching(key, filterValue) || isMatching(cookieParse[key], filterValue)) {
        cookies[key] = cookieParse[key];
      }
    }
  }
  renderCookie(cookies);
}

const globalParse = parseCookie();
renderCookie(globalParse);
