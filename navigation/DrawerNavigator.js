import React,{Component} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator'
import Profile from '../screens/Profile'
import Logout from "../screens/Logout";
import StackNavigator from './StackNavigator';
import firebase from "firebase";
import CustomSidebarMenu from '../screens/CustomSideBarMenu';

const Drawer = createDrawerNavigator();
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class DrawerNavigator extends Component{
  constructor(){
    super();
    this.state = {
      light_theme : true
    }
  }

  componentDidMount(){
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
  render(){
    let props = this.props;
    return (
      <Drawer.Navigator 
      drawerContentOptions = {{ 
        activeTintColor : this.state.light_theme?'#e91e63':'#e91e63' ,
        inactiveTintColor :  this.state.light_theme ? 'white' : 'black',
        itemStyle : {marginVertical : 5}}}
        drawerContent = {(props)=> <CustomSidebarMenu {...props}/>}
        >
       <Drawer.Screen name="Home" component={StackNavigator} options={{ unmountOnBlur: true, drawerIcon: ({ focused, size }) => ( <Ionicons name="home" size={size} color={focused ? '#e91e63' : 'red'} /> ), }} />
        <Drawer.Screen name='Profile' component={Profile} options={{ unmountOnBlur: true, drawerIcon: ({ focused, size }) => ( <Ionicons name="person-circle" size={size} color={focused ? '#e91e63' : 'red'} /> ), }}/>
        <Drawer.Screen name='Logout' component={Logout} options={{ unmountOnBlur: true, drawerIcon: ({ focused, size }) => ( <Ionicons name="log-out" size={size} color={focused ? '#e91e63' : 'red'} /> ), }}/>
      </Drawer.Navigator>
    )
  }


}