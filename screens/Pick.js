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
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
export default class Pick extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontsLoaded: false,
      light_theme: true,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
    };
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

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  likeAction = () => {
    // true (like) ---- dislike (false)
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.props.route.params.story.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({
        likes: (this.props.route.params.story.likes += 1),
        is_liked: true,
      });
    }
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: myPick }) => {
    return <Pick story={myPick} />;
  };

  render() {
    let post = this.state.story_data;
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
        // <View style={styles.container}>
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate('PostScreen', {
              story: post,
            })
          }>
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }>
            <Image
              source={images[post.preview_image]}
              style={styles.PickImage}
            />
            <View style={styles.titleContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.AuthorTextLight
                    : styles.AuthorText
                }>
                Author : {post.author}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.captionTextLight
                    : styles.captionText
                }>
                Caption : {post.description}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={
                  this.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
                onPress={() => {
                  this.likeAction();
                }}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.likeTextLight
                        : styles.likeTexfbt
                    }>
                    {this.state.likes}
                  </Text>
                  <Ionicons
                    name={'heart'}
                    size={RFValue(30)}
                    color={this.state.light_theme ? 'white' : 'pink'}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },
  cardContainerLight: {
    margin: RFValue(13),
    backgroundColor: 'black',
    borderRadius: RFValue(20),
  },
  PickImage: {
    resizeMode: 'contain',
    width: '95%',
    alignSelf: 'center',
    height: RFValue(250),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: 'center',
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  AuthorText: {
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  AuthorTextLight: {
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  captionText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 13,
    color: 'black',
    paddingTop: RFValue(10),
  },
  captionTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 13,
    color: 'white',
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'red',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  likeTextLight: {
    color: 'red',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
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
