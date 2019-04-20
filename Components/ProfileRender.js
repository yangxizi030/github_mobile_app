import React from 'react';
import {Button, ImageBackground, AsyncStorage, AppRegistry, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, WebView, FlatList, Linking } from 'react-native';
import {SearchBar, Header, CheckBox, SocialIcon, Badge, Card, ListItem, Icon, Avatar } from 'react-native-elements'
import { AreaChart, Grid } from 'react-native-svg-charts'
import FollowingPageRender from './FollowingPageRender.js'
import FollowerPageRender from './FollowerPageRender.js'
import LoadingPageRender from './LoadingPageRender.js'
import {ifstarRepo, starRepo, unstarRepo} from './utils.js'
import {getCommits} from './search_utils.js'
import {styles} from './style.js'
import CONST from './const.js'

// Main Class

export default class ProfileRender extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: this.props.login,
      isLoading: true,
      orientation: this.isPortrait() ? 'portrait' : 'landscape',
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
      commit: new Array([0],[0],[0])
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape',
        screenHeight: Dimensions.get('window').height,
        screenWidth: Dimensions.get('window').width,
      });
    });
  };

  componentDidMount() {
    this.props.onRef(this)
    this.retrieveData()
    .then(() => {
      this.setState({
        isLoading: false
      })
    })
  }

  retrieveData = async () => {
    const profile = await AsyncStorage.getItem('profileInfo')
    const repo = await AsyncStorage.getItem('repoInfo')
    let arr = new Array(repo.length)
    for (var i=0; i<arr.length; i++) {
      arr[i] = false
    }
    this.setState({
      dataSource: JSON.parse(profile),
      repoSource: JSON.parse(repo),
      starArr: arr,
      data: JSON.parse(repo)
    })
  }

  renderHeader = () => {
    return (
      <SearchBar placeholder="Type Here..." value={this.state.search}
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false} containerStyle={{marginBottom: 30, height:40}}
      />
    );
  };

  searchFilterFunction = text => {
  const newData = this.state.repoSource.filter(item => {
     const itemData = `${item.name.toUpperCase()}`;
     const textData = text.toUpperCase();
     return itemData.indexOf(textData) > -1;
  });
  this.setState({ data: newData, search:text });
 };

  // Check if the screen is in portrait mode
  isPortrait = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
  };

  // Scroll to Repo Page
  scrollToRepo = () => {
    this.forceUpdate()
    this.props.scroller.scrollTo({x: 0, y: this.state.screenHeight})
  };

  // Scroll to Following Page
  scrollToFollowing = () => {
    this.props.scroller.scrollTo({x: -1 * this.state.screenWidth, y: 0})
  };

  // Scroll to Follower Page
  scrollToFollower = () => {
    this.props.scroller.scrollTo({x: this.state.screenWidth, y: 0})
  };

  refresh = async () => {
     const loginToken = await AsyncStorage.getItem('login');
     this.setState({
       isLoading: true,
       login: loginToken
     })
     fetch('https://api.github.com/users/' + this.state.login)
       .then((response) => response.json())
       .then((responseJson) => {
         fetch('https://api.github.com/users/'.concat(this.state.login, '/repos'))
         .then((response) => response.json())
         .then((repoJson) => {
           for (let i=0; i<repoJson.length; i++) {
             this.getCommitData(repoJson[i].full_name, i)
             .then(() => {
               if (i == repoJson.length - 1) {
                 this.setState({isLoading: false})
               }
             })
           }
           this.setState({
             dataSource: responseJson,
             repoSource: repoJson,
             data: repoJson
           })
         })
       });
   };

   reset = async () => {
     await AsyncStorage.setItem('login', CONST.HOME_LOGIN)
     this.refresh()
   }

   getCommitData = (repo, idx) => {
     this.setState({isLoading: true})
     return getCommits(repo).then((responses) => {
       arr = new Array()
       for (let i=0; i<responses.length; i++) {
         arr.push(JSON.parse(responses[i]['_bodyInit']).length)
       }
       this.state.commit[idx] = arr
       this.setState({commit: this.state.commit})
     })
 }
  // Render Function
  render() {
    const fill = 'rgb(134, 65, 244)'
    if (this.state.isLoading === false) {
      if (this.state.orientation === 'portrait') {
      return (
          <>
          <View style={{flex: 1, flexDirection: 'row', height: this.state.screenHeight-70, width: this.state.screenWidth}}>
            <View style={styles.leftSide}>
              <TouchableOpacity onPress={this.scrollToFollowing}>
                <Text style={styles.leftRotate}>↑Following:{this.state.dataSource['following']}</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.profile}>

             <Image source={{uri:this.state.dataSource['avatar_url']}} style={styles.profileAvatar} />
             <Text style={[styles.title, styles.blackText, {marginTop:80}]}>                  GitHub                      </Text>
             <Text style={{marginTop: 60}} >Name: {this.state.dataSource['name']}</Text>
             <Text>Username: {this.state.dataSource['login']} </Text>
             <Text>Bio: {this.state.dataSource['bio']}</Text>
             <Text>Website: {this.state.dataSource['blog']}</Text>
             <Text>Email: {this.state.dataSource['company']}</Text>
             <Text>Profile Create Date: {this.state.dataSource.created_at.split('T')[0]}</Text>

             <TouchableOpacity onPress={this.scrollToRepo}>
              <Text style={{marginTop: 250}}> ↓ Public Repos {this.state.dataSource['public_repos']}</Text>
             </TouchableOpacity>
            </View>

            <View style={[styles.rightSide]}>
              <TouchableOpacity onPress={this.scrollToFollower}>
                <Text style={{transform : [{rotate: '90deg'}],fontSize: 11}}>↑Followers: {this.state.dataSource['followers']}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1, height: this.state.screenHeight, marginTop: 40}}>
          <Card>
            <Text style={{backgroundColor: 'black', fontSize: 25, color: 'white', marginBottom: 20}}>    Public Repositories</Text>
            <FlatList ListHeaderComponent={this.renderHeader}
                      data={this.state.data}
                      keyExtractor={(item, index) => item.name}
                      renderItem={({item, index}) =>
                                  <>
                                  <Text style={[styles.blackText, {fontSize: 16}]} onPress={() => Linking.openURL(item.html_url)}>
                                      →  {item.name}
                                  </Text>
                                  <Icon containerStyle={{marginLeft:270}} name='star'
                                  color={this.state.starArr[index] ? 'yellow' :'black'}
                                  onPress={ () => {
                                     ifstarRepo(item.full_name)
                                     .then((star) => {
                                       if (star) {
                                          unstarRepo(item.full_name)
                                          this.state.starArr[index] = false
                                          this.setState({starArr: this.state.starArr})
                                       } else {
                                          starRepo(item.full_name)
                                          this.state.starArr[index] = true
                                          this.setState({starArr: this.state.starArr})
                                       }
                                     })
                                  }}/>
                                  <Text style={{marginBottom:10}}>    Owner:  {item.owner.login} </Text>
                                  <Text style={{marginBottom:10}}>    Description:  {item.description} </Text>
                                  <AreaChart
                style={{ height: 100 }}
                data={ this.state.commit[index] }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}
            >
                <Grid/>
            </AreaChart>
                                  </>
                                }

             />
          </Card>
          </View>

          </>
      )
    } else {

      return (
        <>
          <View style={{flex: 1, flexDirection: 'row', height: this.state.screenHeight-70, width: this.state.screenWidth}}>

            <View style={styles.leftSide}>
              <TouchableOpacity onPress={this.scrollToFollowing}>
                <Text style={{transform : [ { rotate: '-90deg'}]}}>↑ Followering: {this.state.dataSource['following']}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profile}>
             <Text style={[styles.title, styles.blackText]}>               GitHub               </Text>
             <Image source={{uri:this.state.dataSource['avatar_url']}} style={{width: 100, height: 100}} />
             <Text>Name: {this.state.dataSource['name']}</Text>
             <Text>GitHub username: {this.state.dataSource['login']} </Text>
             <Text>Bio: {this.state.dataSource['bio']}</Text>
             <Text>Website: {this.state.dataSource['blog']}</Text>
             <Text>Email: {this.state.dataSource['company']}</Text>
             <Text>Profile Create Date: {this.state.dataSource.created_at.split('T')[0]}</Text>

             <TouchableOpacity onPress={this.scrollToRepo}>
              <Text>↓ Public Repos {this.state.dataSource['public_repos']}</Text>
             </TouchableOpacity>
            </View>

            <View style={[styles.rightSide]}>
              <TouchableOpacity onPress={this.scrollToFollower}>
                <Text style={{transform : [{rotate: '90deg'}]}}>↑ Followers: {this.state.dataSource['followers']}</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={{flex: 1, flexDirection: 'row', position: 'absolute', top:this.state.screenHeight, height: this.state.screenHeight, width: this.state.screenWidth}}>
          <Card>
            <Text style={styles.title}>    Public Repositories</Text>
            <FlatList style={{marginTop: 30}}
                      data={this.state.repoSource}
                      keyExtractor={(item, index) => item.name}
                      renderItem={({item, index}) =>
                                  <>
                                  <Text style={[styles.blackText, {fontSize: 16}]} onPress={() => Linking.openURL(item.html_url)}>
                                      →  {item.name}
                                  </Text>
                                  <Icon containerStyle={{marginLeft:270}} name='star'
                                  color={this.state.starArr[index] ? 'yellow' :'black'}
                                  onPress={ () => {
                                     ifstarRepo(item.full_name)
                                     .then((star) => {
                                       if (star) {
                                          unstarRepo(item.full_name)
                                          this.state.starArr[index] = false
                                          this.setState({starArr: this.state.starArr})
                                       } else {
                                          starRepo(item.full_name)
                                          this.state.starArr[index] = true
                                          this.setState({starArr: this.state.starArr})
                                       }
                                     })
                                  }}/>
                                  <Text style={{marginBottom:10}}>    Owner:  {item.owner.login} </Text>
                                  <Text style={{marginBottom:10}}>    Description:  {item.description} </Text></>}
             />
          </Card>
          </View>
          </>
      )
    }
    } else {

      return (
        <LoadingPageRender/>
      )
    }
  }
}
