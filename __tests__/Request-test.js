import React from 'react';
import {fetchUserInfo, followUser, unfollowUser, ifstarRepo, starRepo, unstarRepo} from '../Components/utils.js'
import renderer from 'react-test-renderer';
import CONST from '../Components/const.js'

const testRepo = CONST.HOME_LOGIN + '/Actor_Banner'

test("Fetch user info correctly", () => {
  fetchUserInfo(CONST.HOME_LOGIN)
  .then(response => {
    expect(response.status).toEqual(200)
    expect(response.login).toEqual(CONST.HOME_LOGIN)
  })
});

test("Follow user correctly", () => {
  followUser(CONST.HOME_LOGIN)
  .then(response => {
    expect(response.status).toEqual(204)
  })
});

test("Unfollow user correctly", () => {
  unfollowUser(CONST.HOME_LOGIN)
  .then(response => {
    expect(response.status).toEqual(204)
  })
});

test("Star repo correctly", () => {
  starRepo(testRepo)
  ifstarRepo(testRepo)
  .then(response => {
    expect(response).toEqual(true)
  })
});

test("Unstar repo correctly", () => {
  starRepo(testRepo)
  ifstarRepo(testRepo)
  .then(response => {
    expect(response).toEqual(false)
  })
});
