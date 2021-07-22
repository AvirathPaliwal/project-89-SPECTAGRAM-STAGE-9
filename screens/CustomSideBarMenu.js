import React, { Component } from 'react';
import {
          View,
          Text,
          StyleSheet,
          Platform,
          StatusBar,
          Image,
          Dimensions,
          SafeAreaView,
          TouchableOpacity,
} from 'react-native';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';


export default class CustomSidebarMenu extends Component {
          constructor(props) {
                    super(props);
                    this.state = {
                              light_theme: true,
                    };
          }
          componentDidMount() {
                   this.fetchUser()
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

          render() {
                    let props = this.props;
                    return (
                              <View
                                        style={{
                                                  flex: 1,
                                                  backgroundColor: this.state.light_theme ? 'black' : 'white',
                                        }}>
                                        <Image
                                                  source={require('../assets/logo1.png')}
                                                  style={styles.sideMenuProfileIcon}
                                        />
                                        <DrawerContentScrollView {...props}>
                                             <DrawerItemList {...props}/>     
                                        </DrawerContentScrollView>
                              </View>


                    )
          }

}

const styles = StyleSheet.create({
          sideMenuProfileIcon:{
                    width: RFValue(140),
                    height: RFValue(140),
                    borderRadius: RFValue(70),
                    alignSelf: 'center',
                    marginTop: RFValue(60),
                    resizeMode: 'contain',
          }  
})
