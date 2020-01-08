import React, { Component } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-community/google-signin';
import {firebase} from '@react-native-firebase/auth'
import LoadingPanel from "../LoadingPanel/LoadingPanel";
import {UserContext} from '../UserProvider/UserProvider'

export default class LoginPanel extends Component{
  static contextType = UserContext
    
  constructor(){
        super();
        this.state = {
            userFirebase:'',
            userInfo:null,
            loggedIn: false,
            showLoadingPanel: true,
            error:null,
            
        }            
    }


    componentDidUpdate(prevProps) {
      if (prevProps.isFocused !== this.props.isFocused) {
        Alert.alert('', 'Wołają')
      }
    }

    componentDidMount = async ()=>{
        GoogleSignin.configure({
            webClientId: '1032936370046-lvr0st4f6ca7lrg0pe8g6ene4qinsvgu.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true,
             });
    
            //const userInfo = await this.getCurrentUserInfo();
            
            const mustSignOut = this.props.navigation.getParam('eventId');
            if(mustSignOut){
              this.signOut();
            }
            this.setState({showLoadingPanel: false});
            
            if(userInfo){
             this.props.navigation.navigate('MainPanel');
             // this.props.navigation.navigate('Chat', { name: this.context.user.user.displayName});
             //this.props.navigation.navigate('AddEvent');
             //this.props.navigation.navigate('Event', {eventId:"ZOabb9bsKi9PK7Q9Intc"});
             //this.props.navigation.navigate('Events', {mode:"all"});


              
            }
        
    }

    getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          if(userInfo){
          this.signInWithCredential(userInfo); 
          }    
          return userInfo;
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            this.setState({ loggedIn: false }); 
          } else {
            this.setState({ loggedIn: false });
          }
        }
        return null;
      };

      signIn = async () => {
        try {

          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          await this.signInWithCredential(userInfo);
          //this.props.navigation.navigate('Chat', { name: this.context.user.user.displayName});
          //this.props.navigation.navigate('AddEvent');
          //this.props.navigation.navigate('Event',{eventId: "ZOabb9bsKi9PK7Q9Intc"} );
          //this.props.navigation.navigate('Events', {mode:"all"});
          this.props.navigation.navigate('MainPanel');




        } catch (error) {         
            this.setState({ error });
        }
      };
      signOut = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ userInfo: null, loggedIn: false }); 
        } catch (error) {
          console.error(error);
        }
      };

      signInWithCredential = async (userInfo)=>{
        const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        this.context.setUser(firebaseUserCredential);
        this.context.setLoggedIn(true);
      }

    render() {
      const {userFirebase, userInfo, showLoadingPanel} = this.state;
      
        return(
            <>
                {!showLoadingPanel && <View style={styles.LoginPanel}>
                  <Text style={styles.Header}>TrainWithMe</Text>
                    <GoogleSigninButton
                    style={{ width: 192, height: 62 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={this.signIn}
                    disabled={false} />                   
                </View>}
                {showLoadingPanel&&<LoadingPanel/>}
            </>)
      }
      
}

const styles = StyleSheet.create({
  LoginPanel: {
      display: "flex",
      flex: 1,
      flexDirection: 'column',

      alignItems:"center",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor:'black',

  },
  Header:{
    fontSize:40,
    color:'white',
    marginBottom:200,
    marginTop:40
  }
})