export default class vkAPI {
  constructor(appId, perms) {
    this.appId = appId;
    this.perms = perms;
  }

  init() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://vk.com/js/api/openapi.js?169';
      document.body.appendChild(script);
      script.addEventListener('load', resolve);
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      VK.init({
                apiId: this.appId,
              });

      VK.Auth.login((response) => {
        if (response.session) {
          resolve(response);
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, this.perms);
    });
  }

  callApi(method, params) {
    params.v = params.v || '5.62';

    return new Promise((resolve, reject) => {
      VK.api(method, params, (response) => {
        if (response.error) {
          reject(new Error(response.error.error_msg));
        } else {
          resolve(response.response);
        }
      });
    });
  }

  getFriends() {
    return this.callApi('friends.get', { fields: ['photo_50'] });
  }

  getUsers(ids) {
    const params = { fields: ['photo_50'],
      user_ids: ids,
    };

    return this.callApi('users.get', params);
  }
}
