import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  leftSide: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  profile: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  repo: {
    fontSize: 15,
    marginTop: 20,
    lineHeight: 20
  },
  title: {
    fontSize: 20
  },
  blackText: {
    backgroundColor: 'black',
    color: 'white'
  },
  whiteText: {
    backgroundColor: 'white',
    color: 'black'
  },
  followAvatar: {
    width: 70,
    height: 70
  },
  leftRotate: {
    transform : [{rotate: '-90deg'}],
    fontSize: 10
  },
  profileAvatar: {
    width: 100,
    height: 100,
    marginTop: 40
  },
  page: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute'
  }
});

export { styles }
