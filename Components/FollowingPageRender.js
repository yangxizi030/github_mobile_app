import React from 'react';
import {ImageBackground, AsyncStorage,AppRegistry, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, WebView, FlatList, Linking } from 'react-native';
import {styles} from './style.js'
import {fetchUserInfo, followUser, unfollowUser} from './utils.js'
import {searchUsers} from './search_utils.js'
import {SearchBar, Header, CheckBox, SocialIcon, Badge, Card, ListItem, Button, Icon, Avatar } from 'react-native-elements'
import LoadingPageRender from './LoadingPageRender.js'


// Class for rendering Following Page

export default class FollowingPageRender extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      followingData: '',
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
      followings: [],
      search: null,
      data: [],
      text: ''
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape',
        screenHeight: Dimensions.get('window').height,
        screenWidth: Dimensions.get('window').width,
      })
    })
  }

  // Check if the screen is in portrait mode
  isPortrait = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
  };

  // Get login token
  retrieveData = async () => {
    const login = await AsyncStorage.getItem('login')
    return login
  }

  searchFilterFunction = text => {
    if (text != '') {
      const newData = this.state.followings.filter(item => {
         const itemData = `${item.login.toUpperCase()}`;
         const textData = text.toUpperCase();
         return itemData.indexOf(textData) > -1;
      });
      this.setState({ data: newData, search: text });
    } else {
        this.setState({ data: this.state.followings, search: text });
    }
 };

componentDidMount() {
   this.setState({
     loading: true
   })

   // Use login token fetch following information and parse into array
   this.retrieveData().then((login) => {
     fetch('https://api.github.com/users/'.concat(login, '/following'))
            .then((response) => response.json())
            .then((resJson) => {
              var followingArr = []
              for (var i=0; i < resJson.length; i++) {
                followingArr.push({
                  name: resJson[i]['login'],
                  avatar: resJson[i]['avatar_url'],
                  login: resJson[i]['login'],
                  follow: true
                })
              }
             this.setState({
              loading: false,
              followingData: resJson,
              screenHeight: Dimensions.get('window').height,
              screenWidth: Dimensions.get('window').width,
              followings: followingArr,
              data: followingArr
             })
          });
   })
 }

  // Scroll to profile page
  scrollToProfile(login) {
    AsyncStorage.setItem('login', login);
    this.props.scroller.scrollTo({x: 0, y: 0})
  };

  // Toggle Follow/Unfollow
  toggleFollow(i) {
    this.state.followings[i].follow = !this.state.followings[i].follow
    this.setState({followings: this.state.followings})
  }

  render() {
    if (!this.state.loading) {
    return (
      <View style={[styles.page, {right:this.state.screenWidth, top:0, height: this.state.screenHeight, width: this.state.screenWidth}]}>
      <Header leftComponent={{ icon: 'sync', color: '#fff', onPress: () => this.componentDidMount()}}
              containerStyle={{height: 70}} backgroundColor='#000'
              rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.componentDidMount()}}/>
      <ScrollView ref={(scroller) => {this.scroller = scroller}}>
      <SearchBar placeholder="Type user's login to search" value={this.state.search}
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false} containerStyle={{marginBottom: 30, height:40}}
      />
      <Card title='Following'>
        {
            this.state.data.map((u, i) => {
                return (
                  <View key={i} style={[styles.user, {backgroundColor:'white', flex:1, flexDirection:'row'}]}>
                    <View style={{flex:2}}>
                      <Avatar source={{uri:u.avatar}} size='large'/>
                      <Text style={{marginTop:10,height:30}}>{u.name}</Text>
                    </View>
                    <View style={{flex:5}}>
                      <ImageBackground source={require('./background.jpg')} style={{width: '100%', height: '100%'}}>
                      <SocialIcon title='Nav to GitHub Page' button light type='github'
                      style={{height:50, width:200}} onPress={() => this.scrollToProfile(u.login)}/>
                      <Badge onPress={() => {
                        if (u.follow) {
                          unfollowUser(u.login)
                        } else {
                          followUser(u.login)
                        }
                        this.toggleFollow(i)
                      }}
                      containerStyle={{marginTop:5, marginLeft:100}}
                      value={u.follow ? 'Unfollow' :'Follow'} status={u.follow ? 'warning':'success'} />
                      </ImageBackground>
                  </View>
                </View>
              );
            })
        }
      </Card>
      </ScrollView>
      </View>
    );
  } else {
    return (
      <LoadingPageRender/>
    )
  }
  }
}
