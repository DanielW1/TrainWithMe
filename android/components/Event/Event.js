import React, {Component} from 'react'
import {Image, Text, StyleSheet, Alert, TouchableHighlight, View} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import FirebaseService from '../FirebaseService/FirebaseService';
import Button from '../Button';
import {UserContext} from '../UserProvider/UserProvider'

export default class Event extends Component{
    static contextType = UserContext
    constructor(){
        super();
        this.state = {
            event:{},
            eventId: null,
            justJoined: false,
            participients:[],
            organizer:false,
        }
    }
    componentDidMount = ()=>{
        let eventId = this.props.navigation.getParam('eventId');
        this.setState({eventId});
        FirebaseService.shared.eventRef.doc(eventId)
        .get().then((doc) =>{
            this.setState({event: doc.data()}, this.getCategory);
            if(FirebaseService.shared.uid.localeCompare(doc.data().organizer) == 0)
        {
            this.setState({organizer:true});
        }
    });

        let result = FirebaseService.shared.isTakePartInEvent(FirebaseService.shared.uid, eventId);
        result.get().then(docs =>{
            if(docs.size>0){
                this.setState({justJoined:true});
            }
        })

        let participients = FirebaseService.shared.findAllParticipientsEvents(eventId);
        participients.get().then(docs =>{
            docs.forEach( doc =>{
                this.setState((state)=>({
                    participients: state.participients.concat({item:doc.data(), _id: doc.id})
                }))
            })
        })

        
        if(FirebaseService.shared.uid.localeCompare(this.state.event.organizer) == 0)
        {
            this.setState({organizer:true});
        }
       
    }

    onAcceptButton = (item, id)=>{
        item.isAccepted = true;
        FirebaseService.shared.updateParticipient(item, id);
        const {participients} = this.state;
        const newParticipants = participients.slice();
        
        let newParticipant = newParticipants.find(item => item._id.localeCompare(id) == 0);
        newParticipant.isAccepted = true;

        this.setState({participients: newParticipants.slice()})
    }

    getCategory = () =>{FirebaseService.shared.sportsRef.doc(this.state.event.sport_id)
        .get().then(doc =>{
            let item ={
                ...this.state.event,
                category: doc.data(),
            }
            this.setState({event:item})
       })}

       onPressJoinButton = ()=>{
           if(!this.state.justJoined){
           const uid = FirebaseService.shared.uid;
           const eventId = this.state.eventId;

           FirebaseService.shared.joinToEvent({uid, eventId, isAccepted:false,
             displayName:this.context.user.user.displayName});

           Alert.alert('Wysłano prośbę o dołącznie do wydarzenia')
           }
       }

       onPressChat = () =>{
            const {eventId, event} = this.state;
           this.props.navigation.navigate('Chat',
           {name: this.context.user.user.displayName, eventId, title: event.name},)
       }

    renderItem = ({item, _id})=>{
        const {organizer} = this.state;
        return <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", minHeight:40,
         alignItems:"center", backgroundColor:"#e6e6e6", borderBottomColor:"white", borderBottomWidth:2}}>
            <Text>{item.displayName? item.displayName:"Brak nazwy"}</Text>
            {  organizer && !item.isAccepted && <Button size="small" text={"Akceptuj"} onPress={()=>this.onAcceptButton(item, _id)}/>}
        </View>
    }

    render(){
        const {event:{name, category, description, dateTime, limit, location, costOnPerson},
        justJoined, participients } = this.state;
        return(<><ScrollView contentContainerStyle={styles.card}>
            <Image style={styles.image} source={{uri:category? category.image_url:""}}/>
            {justJoined && <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginTop:10}}>
                <TouchableHighlight style={{width:50, height:50}} onPress={this.onPressChat}>
                    <Image source={require('./../../assets/Message-512.png')} style={{width:50, height:50}}/>
                </TouchableHighlight>
            </View>}
            
                <Text style={styles.header}>{name}</Text>
                <Text style={styles.text}>Kategoria: {category?category.name:""}</Text>
                <Text style={styles.text}>Termin: {dateTime}</Text>
                <Text style={styles.text}>Lokalizacja: {location}</Text>
                <Text style={styles.descriptionLabel}>Opis:</Text>
                <Text style={styles.text}>{description}</Text>
                <Text style={styles.text}>Liczba osób: {limit? limit:"Brak limitu"}</Text>
                <Text style={styles.text}>Opłata: {costOnPerson? costOnPerson:"Brak"}</Text>    
                <Text style={{height:60}}></Text>  
                <Text></Text>   
                {justJoined && <View>
                    <Text style={{fontSize:24}}>Uczestnicy:</Text>
                    {participients.map( elem =>this.renderItem(elem))}
                    <Text style={{height:60, fontSize:20}}></Text> 
                </View>   }                  

        </ScrollView>
        <Button size="medium" text={justJoined ? "Już bierzesz udział" :"Dołącz" } onPress={this.onPressJoinButton} fixed/>
        </>)
    }
}

const styles = StyleSheet.create({
    card:{
        padding: 10,
        marginLeft:"2%",
        width:"90%",
    },
    image:{
        width:"100%",
        height:200,
        resizeMode:"cover",
    },
    header:{
        fontSize:24,
        marginBottom:10,
    },
    text:{
        fontSize:16,
        marginBottom:5,
    },
    descriptionLabel:{
        fontSize:16,
        marginTop:10,
        marginBottom:5,
    },
})