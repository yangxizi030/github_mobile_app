import React from 'react';
import FollowingPageRender from '../Components/FollowingPageRender.js'
import renderer from 'react-test-renderer';

test("renders correctly", () => {
  const tree = renderer.create(<FollowingPageRender/>).toJSON();
  expect(tree).toMatchSnapshot();
});
