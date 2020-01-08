import React, {Component} from  "react";
import {TouchableHighlight, Text, StyleSheet} from "react-native";


//size [medium, small, large]
//
export default class Button extends Component{
        

    render(){
        const {onPress, text, size="medium", button2, color,fixed } = this.props;
        return <TouchableHighlight underlayColor="gray" onPress={onPress} style={[styles[size],button2?styles.Button2:styles.Button,fixed ? styles.sticky:""]}>
            <Text style={color?{color:color}:styles.color}>{text}</Text>
        </TouchableHighlight>
    }
}
const styles = StyleSheet.create({
    large:{
        width:"100%",
        height:80,
    },
    small:{
        width: "40%",
        height: 40,
    },
    medium:{
        width: "70%",
        height: 50,
    },
    Button:{
        backgroundColor:"black",
        borderColor:"black",
        borderWidth:5,
        margin:10,
        padding:10,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginLeft:"auto",
        marginRight:"auto",

        
    },
    Button2:{
        backgroundColor: "#00BFFF",
        borderColor: "white",
        borderWidth: 5,
        padding: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
    },
    color:{
        color: "white",
    },
    sticky:{
        bottom:0,
        left:0,
        width:"100%",
        position:"absolute",
    }
})