import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Pick from './Pick';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let Picks = require('./PostPick.json');

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      all_photos:[]
    }
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchPhotos();
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: myPick }) => {
    return <Pick story={myPick} navigation={this.props.navigation} />;
  };
  
  fetchPhotos= () => {
    firebase
      .database()
      .ref('/posts/')
      .on('value', (snapshot) => {
        let photos = [];
        if (snapshot.val()) {
          Object.keys(snapshot.val()).forEach(function (key) {
            photos.push({
              key: key,
              value: snapshot.val()[key]
            })
          })
        }
        this.setState({ all_photos: photos })
        this.props.setUpdateToFalse()

      },
        function (errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      )
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo1.png')}
                style={styles.iconImage}
              />
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                SPECTAGRAM
              </Text>
            </View>
          </View>
          {!this.state.all_photos[0] ?
            (<View style={styles.noPhoto}>
              <Text style={this.state.light_theme?styles.noPhoteTextLight:styles.noPhoteText}>
                No Photos Available 
                </Text>
            </View>) : (<View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.all_photos}
                renderItem={this.renderItem}
              />
            </View>)
          }
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '200%',
    height: '200%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  cardContainer: {
    flex: 0.85,
  },
  noPhoto:{
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  noPhoteText:{
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  noPhoteTextLight:{
    color: 'black',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',

  }
});
