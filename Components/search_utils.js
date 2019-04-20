import CONST from './const.js'

export function searchUsers(login) {
  const base64 = require('base-64');
  let params = "q=".concat(login, " in:login")
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return fetch('https://api.github.com/search/users' + params, {
    method: 'GET',
    headers: headers
  })
  .then((response) => {
    return response
  });
}

export function getCommits(repo) {
  const promises = new Array();
  const TIME_LINE = new Array(CONST.JAN_2019_FIRST, CONST.JAN_2019_SECOND, CONST.FEB_2019_FIRST, CONST.FEB_2019_SECOND, CONST.MARCH_2019_FIRST, CONST.MARCH_2019_SECOND);
  const base64 = require('base-64');
  let headers = new Headers();
  headers.set("Authorization", "Basic " + base64.encode(CONST.HOME_LOGIN +':' +CONST.HOME_PASSWORD));
  headers.set("Content-Type", "application/x-www-form-urlencoded");
  for (let i=0; i<TIME_LINE.length; i++) {
    promises.push(fetch('https://api.github.com/repos/' + repo + '/commits' + TIME_LINE[i], {
      method: 'GET',
      headers: headers
    }))
  }
  return Promise.all(promises)
}
