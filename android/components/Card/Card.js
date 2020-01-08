import React, {Component} from 'react'
import {StyleSheet, Alert, TouchableHighlight} from 'react-native'
import { Image, Text,View } from 'react-native';


export default class Card extends Component{
    constructor(){
        super();
    }
    onPress = ()=>{
        Alert.alert("Onie");
    }

    render(){
        const {item:{name, category, dateTime, cost, id}, onPress } = this.props;
        return (<TouchableHighlight style={styles.card} onPress={onPress}>
                <View>
                <Image source={{uri:category? category.image_url : ""}} style={styles.cardImage}/>
                <Text style={styles.text}>{name}</Text>
                {category && <Text>Kategoria: {category.name}</Text>}
                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    <Text>Data: {dateTime}</Text>
                    <Text>Koszt: {cost}</Text>
                </View> 
                </View>
        </TouchableHighlight>)
    }
}

const styles = StyleSheet.create({
    card:{
        display:"flex",
        padding: 10,
        marginBottom:10,
        marginLeft:"2%",
        width:"90%",
        elevation:2,
        borderRadius:2,

    },
    cardImage:{
        width:"100%",
        height:200,
        resizeMode:"cover",
    },
    text:{
        fontSize:20
    }
})