import './index.html';
import './main.css';
// const Handlebars = require("handlebars");
import template from './tamplate.hbs';

VK.init({apiId: 7825020});

function auth () {
  return new Promise((resolve, reject) => {
    VK.Auth.login(data => {
      if (data.session) {
        resolve()
      } else {
        reject(new Error('not ok'))
      }
    }, 2)
  });
}

function callAPI(method, params) {
  params.v = 5.62;

  return new Promise((resolve, reject) => {
    VK.api(method, params, (data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.response);
      }
    });
  })
}

auth().then(() => {
  return callAPI('friends.get', {fields: 'photo_50'})
}).then(friends => {

  const fragment = document.createDocumentFragment();
  const results = document.querySelector('.filter-left');

  friends.items.forEach((friend) =>{
    const div = document.createElement('div');
    const li = document.createElement('li');
    const img = document.createElement('img');

    li.classList.add('friend');
    img.classList.add('friend__ava');
    div.classList.add('friend__name');
    img.src = friend.photo_50;
    div.textContent = `${friend.first_name} ${friend.last_name}`;

    li.appendChild(img);
    li.appendChild(div);

    fragment.appendChild(li);

  })

  console.log(fragment);
  results.appendChild(fragment);
});
