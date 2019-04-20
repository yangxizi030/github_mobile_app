import CONST from './const.js'

export function fetchUserInfo(username) {
  return fetch('https://api.github.com/users/' + username)
         .then((response) => response.json())
         .then((resJson) => {
           return resJson;
         });
}

export function followUser(username) {
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return fetch('https://api.github.com/user/following/' + username, {
    method: 'PUT',
    headers: headers
  })
  .then((response) => {
    return response
  });
}

export function unfollowUser(username) {
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return fetch('https://api.github.com/user/following/' + username, {
    method: 'DELETE',
    headers: headers
  })
  .then((response) => {
    return response
  });
}

export function ifstarRepo(repo) {
  console.log(repo)
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return fetch('https://api.github.com/user/starred/' + repo, {
    method: 'GET',
    headers: headers
  })
  .then((response) => {
    return (response.status === 204)});
}

export function starRepo(repo) {
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  fetch('https://api.github.com/user/starred/' + repo, {
    method: 'PUT',
    headers: headers
  })
  .then((response) => {})
  .done();
}

export function unstarRepo(repo) {
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  fetch('https://api.github.com/user/starred/' + repo, {
    method: 'DELETE',
    headers: headers
  })
  .then((response) => {})
  .done();
}

export function fetchNotification() {
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return fetch('https://api.github.com/notifications', {
    method: 'GET',
    headers: headers
  })
  .then((response) => {
    return response
  });
}
