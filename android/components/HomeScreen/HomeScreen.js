import React, {Component} from 'react'
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import {UserContext} from '../UserProvider/UserProvider';
import { GoogleSignin } from '@react-native-community/google-signin';


export default class HomeScreen extends Component{
    static contextType = UserContext
    constructor(){
        super();
    }

    signOut = async () =>{
        GoogleSignin.configure({
            webClientId: '1032936370046-lvr0st4f6ca7lrg0pe8g6ene4qinsvgu.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true,
             });
        try{
             await GoogleSignin.revokeAccess();
             await GoogleSignin.signOut();
             this.setState({ userInfo: null, loggedIn: false }); 
           } catch (error) {
             console.error(error);
           }
           this.props.navigation.navigate('Home', {signOut:true});

    }

    render(){
        return(
            <View style={{marginTop:20,}}>               
                <View style={styles.container}><TouchableHighlight style={styles.panel}
                onPress={()=>this.props.navigation.navigate('Events', {mode:"all"})}><Text style={{color:"white"}}>Wydarzenia</Text></TouchableHighlight>
                
                <TouchableHighlight style={styles.panel}
                onPress={()=>this.props.navigation.navigate('Events', {mode:"organized"})}><Text style={{color:"white"}}>Moje wydarzenia</Text></TouchableHighlight>
                </View>
                <View style={styles.container}><TouchableHighlight style={styles.panel}
                onPress={()=>this.props.navigation.navigate('Events', {mode:"takePart"})}><Text style={{color:"white"}}>Biorę udział</Text></TouchableHighlight>
                
                <TouchableHighlight style={styles.panel}
                onPress={()=>this.props.navigation.navigate('AddEvent')}><Text style={{color:"white"}}>Dodaj wydarzenie</Text></TouchableHighlight>
                </View>
                <View style={styles.container}>
                <TouchableHighlight style={styles.panel}><Text style={{color:"white"}}
                onPress={()=>this.props.navigation.navigate('Home', {signOut:true})}>Chat</Text></TouchableHighlight>
                <TouchableHighlight 
                onPress={this.signOut}
                style={styles.panel}><Text style={{color:"white"}}>Wyloguj</Text></TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        display:"flex",
         flexWrap:"wrap",
          flexDirection:"row",
          justifyContent:"space-around",
           alignContent:"space-around"
    },
    panel:{
        width:"47%",
         height:160, 
         backgroundColor:"black",
          marginBottom:5,
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
    }
})