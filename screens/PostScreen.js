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
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pick from './Pick';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';
import { color } from 'react-native-reanimated';
//import { FlatList } from "react-native-gesture-handler";

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

let story = require('./PostPick.json');

export default class Feed extends Component {
  constructor(props) {
    super(props);
    //rwmove  story_id and  story_data
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      is_liked:false,
   
    }
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
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
  likeAction = () => {
        // true (like) ---- dislike (false)
        if (this.state.is_liked) {
            firebase
                .database()
                .ref('posts')
                .child(this.props.route.params.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(-1));
            this.setState({ likes: (this.props.route.params.story.likes -= 1), is_liked: false });
        }
        else {
            firebase
                .database()
                .ref('posts')
                .child(this.props.route.params.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(1));
            this.setState({
                likes: (this.props.route.params.story.likes += 1),
                is_liked: true,
            })

        }
    }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: myPick }) => {
    return <Pick story={myPick} navigation={this.props.navigation} />;
  };
  render() {
    // let post = this.state.story_data;
    if (!this.state.fontsLoaded) {
      // !true = fale
      return <AppLoading />;
    } else {
      let images = {
        image_1: require('../assets/image_1.jpg'),
        image_2: require('../assets/image_2.jpg'),
        image_3: require('../assets/image_3.jpg'),
        image_4: require('../assets/image_4.jpg'),
        image_5: require('../assets/image_5.jpg'),
        image_6: require('../assets/image_6.jpg'),
        image_7: require('../assets/image_7.jpg'),
      };
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
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                {' '}
                Post Hub{' '}
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardLight
                  : styles.storyCard
              }>
              <Image
                source={images[this.props.route.params.story.preview_image]}
                style={styles.image}
              />
              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyTitleTextLight
                        : styles.storyTitleText
                    }>
                    Caption : {this.props.route.params.story.title}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }>
                    By : {this.props.route.params.story.author}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.descriptionTextLight
                        : styles.descriptionText
                    }>
                    Date : {this.props.route.params.story.created_on}
                  </Text>
                </View>
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={
                    this.state.is_liked
                      ? styles.likeButtonLiked
                      : styles.likeButtonDisliked
                  }>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.likeTextLight
                        : styles.likeText
                    }>
                    {this.state.likes}
                  </Text>
                  <Ionicons
                    name={'heart'}
                    size={RFValue(30)}
                    color={this.state.light_theme ? 'black' : 'red'}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
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
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },
  storyCardLight: {
    margin: RFValue(20),
    backgroundColor: 'black',
    borderRadius: RFValue(20),
    borderWidth: 2,
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
  },
  storyTitleTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'white',
  },
  storyAuthorText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'black',
  },
  storyAuthorTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'white',
  },
  iconContainer: {
    flex: 0.2,
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  likeTextLight: {
    color: "white",
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  descriptionText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 13,
    color: 'black',
    paddingTop: RFValue(10),
  },
  descriptionTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 13,
    color: 'white',
    paddingTop: RFValue(10),
  },
  likeButtonLiked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#eb3948',
        borderRadius: RFValue(30),
    },
    likeButtonDisliked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#eb3948',
        borderWidth: 2,
        borderRadius: RFValue(30),
    },
});
