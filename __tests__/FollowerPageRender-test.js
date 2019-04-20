import React from 'react';
import FollowerPageRender from '../Components/FollowerPageRender.js'
import renderer from 'react-test-renderer';

test("renders correctly", () => {
  const tree = renderer.create(<FollowerPageRender/>).toJSON();
  expect(tree).toMatchSnapshot();
});
