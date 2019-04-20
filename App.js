import React from 'react'
import CONST from './Components/const.js'
import {YellowBox, AsyncStorage, Button, RefreshControl, AppRegistry, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, WebView, FlatList, Linking } from 'react-native'
import ProfileRender from './Components/ProfileRender.js'
import LoadingPageRender from './Components/LoadingPageRender.js'
import FollowingPageRender from './Components/FollowingPageRender.js'
import FollowerPageRender from './Components/FollowerPageRender.js'
import {Overlay, Header, CheckBox, SocialIcon, Badge, Card, ListItem, Icon, Avatar } from 'react-native-elements'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {fetchNotification} from './Components/utils.js'

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

export default class App extends React.Component {

  // Menu config
  _menu = null;

  setMenuRef = ref => {this._menu = ref; };

  hideMenu = () => {this._menu.hide(); };

  showMenu = () => {this._menu.show(); };

  constructor(props) {
    super(props);
    this.state = {
      login: CONST.HOME_LOGIN,
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
      isVisible: true,
      refreshing: true,
      notifications: 'loading..'
    };
    AsyncStorage.setItem('login', CONST.HOME_LOGIN);
  }

  componentDidMount() {
    this.setState({refreshing: true})
    fetchNotification()
    .then((response) => response.json())
    .then((resJson) => {
      this.setState({notifications: resJson})
    })
    this.refresh()
  };

  // Fetch new info everytime when refresh
  refresh = async () => {
    this.setState({refreshing: true})
    const loginToken = await AsyncStorage.getItem('login');
    fetch('https://api.github.com/users/' + loginToken)
    .then((response) => response.json())
    .then((profileJson) => {
      AsyncStorage.setItem('profileInfo', JSON.stringify(profileJson))
      fetch('https://api.github.com/users/'.concat(loginToken, '/repos'))
      .then((response) => response.json())
      .then((repoJson) => {
          AsyncStorage.setItem('repoInfo', JSON.stringify(repoJson))
          this.setState({refreshing: false})
      });
    });
  };

  // Reset to default user
  reset = async () => {
    await AsyncStorage.setItem('login', CONST.HOME_LOGIN);
    this.refresh()
  }

  // Scroll to Repo Page
  scrollToRepo = () => {
    this.forceUpdate()
    this.scroller.scrollTo({x: 0, y: this.state.screenHeight})
  };

  // Scroll to Following Page
  scrollToFollowing = () => {
    this.scroller.scrollTo({x: -1 * this.state.screenWidth, y: 0})
  };

  // Scroll to Follower Page
  scrollToFollower = () => {
    this.scroller.scrollTo({x: this.state.screenWidth, y: 0})
  };

  // Toggle isVisible
  toggleIsVisible = () => {
    this.state.isVisible = !this.state.isVisible
    this.setState({ isVisible: this.state.isVisible})
    this.forceUpdate()
  }


  render() {
    if (!this.state.refreshing) {
      return (
        <ScrollView ref={(scroller) => {this.scroller = scroller}}
        refreshControl={<RefreshControl refreshing={this.state.refreshing}/>}>
        <Header centerComponent={{ icon: 'sync', color: '#fff', onPress: () => this.profile.refresh()}}
                leftComponent={
          <Menu ref={this.setMenuRef}
            button={<Icon name='menu' color='white' onPress={this.showMenu}/>}>
            <MenuItem onPress={this.scrollToRepo}>Repo</MenuItem>
            <MenuItem onPress={this.scrollToFollowing}>Following</MenuItem>
            <MenuItem onPress={this.scrollToFollower}>Follower</MenuItem>
            <MenuItem onPress={this.toggleIsVisible}>Notifications</MenuItem>
          </Menu>
        }
                containerStyle={{ height: 70 }} backgroundColor='#000'
                rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.profile.reset()}}/>
        <FollowingPageRender login={this.refresh} scroller={this.scroller}/>
        <FollowerPageRender login={this.refresh} scroller={this.scroller}/>
        <ProfileRender onRef={ref => (this.profile = ref)} login={this.state.login} scroller={this.scroller}/>
        <Overlay isVisible={this.state.isVisible} width="auto" height="auto"
         onBackdropPress={this.toggleIsVisible}>
         <>
        <SocialIcon title='Notifications' button light raised={false} type='github'/>
        <Badge containerStyle={{marginRight:300}}
        value={<Text>{this.state.notifications[0]['repository']['name']}</Text>}/>
        <Text style={{marginLeft:100}}>{this.state.notifications[0]['subject']['title']}</Text>
        <Badge containerStyle={{marginRight:300}}
        value={<Text>{this.state.notifications[1]['repository']['name']}</Text>}/>
        <Text style={{marginLeft:100}}>{this.state.notifications[1]['subject']['title']}</Text>
        <Badge containerStyle={{marginRight:300}}
        value={<Text>{this.state.notifications[2]['repository']['name']}</Text>}/>
        <Text style={{marginLeft:100}}>{this.state.notifications[2]['subject']['title']}</Text>
        <Badge containerStyle={{marginRight:300}}
        value={<Text>{this.state.notifications[3]['repository']['name']}</Text>}/>
        <Text style={{marginLeft:100}}>{this.state.notifications[3]['subject']['title']}</Text>
        <Badge containerStyle={{marginRight:300}}
        value={<Text>{this.state.notifications[4]['repository']['name']}</Text>}/>
        <Text style={{marginLeft:100}}>{this.state.notifications[4]['subject']['title']}</Text>
        </>
        </Overlay>
        </ScrollView>
      )
    } else {
      return (<LoadingPageRender/>)
    }
  }
};
