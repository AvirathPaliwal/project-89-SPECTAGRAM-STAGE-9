import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import Feed from '../screens/Feed';
import CreatePost from '../screens/CreatePost';
import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();
//functional compenent
export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      isUpdated: false
    };
  }
  changeUpdated = () => {
    this.setState({
      isUpdated: true
    })
  }
  
  removeUpdated=()=>{
    this.setState({
      isUpdated:false
    })
  }
  componentDidMount() {

    this.fetchUser();
  }
  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });

  }
  renderFeed=(props)=>{
   return <Feed setUpdateToFalse={this.removeUpdated} {...props} />;
   
  }
  renderStory=(props)=>{
    return <CreatePost setUpdateToTrue={this.changeUpdated} {...props} />;
  }
  render(){
    return(    
        <Tab.Navigator
        labeled = { false }
        barStyle={styles.bottomTabStyle}
        screenOptions = { ( {route }) =>  ({
          tabBarIcon : ({ focused , color ,size}) =>{
            let iconName;
            if( route.name === "Feed"){
                iconName = focused ? 'home' : 'home-outline'
            }
            else if(route.name === "CreatePost"){
              iconName = focused ? 'add-circle' : 'add-circle-outline'
            }
            return <Ionicons name = { iconName} size = {size} color={color}/>
          },
        })}
        tabBarOptions = {{
          activeTintColor : 'red',
          inactiveTintColor : 'gray'
        }}
        >
          <Tab.Screen name="Feed" component={this.renderFeed} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="CreatePost" component={this.renderStory} options={{ unmountOnBlur: true }} />
        </Tab.Navigator>
    )
}
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "black",
    height: "8%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute"
  },
  icons: {
    //responsive font
    width: RFValue(30),
    height: RFValue(30)
  }
});
