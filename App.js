/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginPanel from './android/components/LoginPanel';
import HomeScreen from './android/components/HomeScreen/HomeScreen';
import {UserProvider} from './android/components/UserProvider/UserProvider'
import Chat from './android/components/Chat';
import AddEventPanel from './android/components/AddEventPanel';
import EventsPanel from './android/components/EventsPanel/EventsPanel';
import Event from './android/components/Event/Event';


const Navigator = createStackNavigator({
  Home:{screen:LoginPanel, navigationOptions: {
    headerShown: false,
  }},
  MainPanel:{screen:HomeScreen, navigationOptions:{
    headerShown: false,
  }},
  Chat:{screen:Chat, navigationOptions:{
    headerStyle:{
      backgroundColor:'black',
    },
    headerTitleStyle:{
      color:'white'
    },
    headerTintColor:"white",
  }},
  AddEvent:{screen:AddEventPanel},
  Events:{screen:EventsPanel, navigationOptions:{
    headerStyle:{
      backgroundColor:'black',
    },
    headerTitleStyle:{
      color:'white'
    },
    headerTintColor:"white",
  }},
  Event:{screen:Event, navigationOptions:{
    headerStyle:{
      backgroundColor:'black',
      color:'white'
    },
    headerTintColor:"white",
  }},
});


const AppContainer = createAppContainer(Navigator);
const App = ()=>{
  
  return (
    <UserProvider>
      <AppContainer></AppContainer>
    </UserProvider>
  )
}
export default App ;
