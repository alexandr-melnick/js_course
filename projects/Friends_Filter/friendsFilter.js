import vkAPI from './vkAPI';
import FriendsList from './friendsList';
import { LocalStorage ,VKStorage } from './storage';

export default class FriendsFilter {
  constructor() {
    this.allFriendsDOMList = document.querySelector('.friends-left');
    this.bestFriendsDOMList = document.querySelector('.friends-right');
    this.allFriendsDOMFilter = document.querySelector('.filter__search');
    this.bestFriendsDOMFilter = document.querySelector('#search-right');

    this.api = new vkAPI(7825020, 2);
    this.allFriends = new FriendsList(new VKStorage(this.api));
    this.bestFriends = new FriendsList(new LocalStorage(this.api, this.lsKey));

    this.init();
  }

  async init() {
    await this.api.init();
    await this.api.login();
    await this.allFriends.load();
    await this.bestFriends.load();

    for (const item of this.bestFriends.valuesIterable()) {
      await this.allFriends.delete(item.id);
    }

    this.reloadList(this.allFriendsDOMList, this.allFriends);
    this.reloadList(this.bestFriendsDOMList, this.bestFriends);

    document.addEventListener('click', this.onClick.bind(this));

    this.allFriendsDOMFilter.addEventListener('input', (e) => {
      this.allFriendsFilter = e.target.value;
      this.reloadList(this.allFriendsDOMList, this.allFriends, this.allFriendsFilter);
    });
    this.bestFriendsDOMFilter.addEventListener('input', (e) => {
      this.bestFriendsFilter = e.target.value;
      this.reloadList(this.bestFriendsDOMList, this.bestFriends, this.bestFriendsFilter);
    });
  }

  isMatchingFilter(source, filter) {
    return source.toLowerCase().includes(filter.toLowerCase());
  }

  reloadList(listDOM, friendsList, filter) {
    console.log(filter);
    const fragment = document.createDocumentFragment();

    listDOM.innerHTML = '';

    for (const friend of friendsList.valuesIterable()) {
      const fullName = `${friend.first_name} ${friend.last_name}`;

      if (!filter || this.isMatchingFilter(fullName, filter)) {
        const friendDOM = this.createFriendDOM(friend);
        fragment.append(friendDOM);
      }
    }

    listDOM.append(fragment);

  }

  createFriendDOM(data) {
    const root = document.createElement('li');

    root.dataset.friendId = data.id;
    root.classList.add('friend');
    root.innerHTML = `
    <img class="friend__ava" src="${data.photo_50}"/>
    <div class="friend__name">${data.first_name} ${data.last_name}</div>
    <div class="friend__swap" data-role="friend-swap" data-friend-id="${data.id}"></div>
    `;

    return root;
  }

  move(friendId, from, to) {
    if (from === 'all' && to === 'best') {
      const friend = this.allFriends.delete(friendId);
      this.bestFriends.add(friend);
    } else if (from === 'best' && to === 'all') {
      const friend = this.bestFriends.delete(friendId);
      this.allFriends.add(friend);
    }

    this.bestFriends.save();
    this.reloadList(this.allFriendsDOMList, this.allFriends, this.allFriendsFilter);
    this.reloadList(this.bestFriendsDOMList, this.bestFriends, this.bestFriendsFilter);
  }

  onClick(e) {
    if (e.target.dataset.role === 'friend-swap') {
      const sourceList = e.target.closest('[data-role="list-items"]').dataset.list;
      const friendId = e.target.dataset.friendId;

      this.move(friendId, sourceList, sourceList === 'all' ? 'best' : 'all');
    }
  }
}
