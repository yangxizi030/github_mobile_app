import React from 'react';
import {ImageBackground, AsyncStorage,AppRegistry, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, WebView, FlatList, Linking } from 'react-native';

// Class for rendering Loading Page

export default class LoadingPageRender extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<Text>The page is loading...</Text>)
  }
}
