import React, {Component} from 'react'
import {StyleSheet, Dimensions, Picker, Text, Alert} from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import DatePicker from 'react-native-datepicker'
import {firebase} from '@react-native-firebase/firestore'
import FirebaseService from './../FirebaseService/FirebaseService'
import CustomTextInput from './../CustomTextInput'
import Button from './../Button'


export default class AddEventPanel extends Component{

    constructor(){
        super();
        this.state={
                name:'',
                dateTime:null,
                location:'',
                limit:null,
                description:'',
                sport_id:null,
                costOnPerson:null,
                organizer: null,
                sports:[],
        }
    }

    componentDidMount = () =>{
        FirebaseService.shared.sportsRef.get().then(docs =>{
            docs.forEach( doc =>{
                this.setState((state) => ({
                   sports: state.sports.concat({id:doc.id, value:doc.data().name}) 
                }))
            })
        })
    }

    onChangeTextNameHandler = (text)=>{
        this.setState({name: text});
    }

    onChangeTextDateTimeHandler = (text)=>{
        this.setState({dateTime: text});
    }

    onChangeTextLocationHandler = (text)=>{
        this.setState({location: text});
    }
    
    onChangeTextLimitHandler = (text)=>{
        this.setState({limit: text});
    }

    onChangeTextDescriptionHandler = (text)=>{
        this.setState({description: text});
    }

    onChangeTextCostHandler = (text)=>{
        this.setState({costOnPerson: text});
    }

    onPressAddButton = () =>{
        const {name,
            dateTime,
            location,
            limit,
            description,
            sport_id,
            costOnPerson,
            } = this.state;
        
        const event = {
        name,
        dateTime,
        location,
        limit,
        description,
        sport_id,
        costOnPerson: costOnPerson? costOnPerson : "0",
        organizer: FirebaseService.shared.uid};
        const uid = FirebaseService.shared.uid;
        FirebaseService.shared.addEvent(event).then( doc =>{
            
            FirebaseService.shared.joinToEvent({uid, eventId:doc.id, isAccepted:true});
            this.setState({name:'',
        dateTime:null,
        location:'',
        limit:null,
        description:'',
        sport_id:null,
        costOnPerson:null,
        organizer: null,
        sports:[],})

        this.props.navigation.navigate("Event", {eventId:doc.id})
        });

        
    }

    render(){
        const{name, dateTime, location, limit, description, costOnPerson, sports, sport_id} = this.state;
        return(<ScrollView contentContainerStyle={styles.FormPanel}>
            <CustomTextInput label="Nazwa" onChangeText={this.onChangeTextNameHandler}
            value={name}/>
            <DatePicker
                style={{width: 200}}
                date={dateTime}
                mode="datetime"
                placeholder="Wybierz datę"
                confirmBtnText="Ok"
                cancelBtnText="Zamknij"
                customStyles={{
                dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                },
                dateInput: {
                    marginLeft: 36
                }
                }}
        onDateChange={this.onChangeTextDateTimeHandler}
      />
            <CustomTextInput label="Lokalizacja" onChangeText={this.onChangeTextLocationHandler}
            value={location}/>
            <CustomTextInput label="Limit uczestników" onChangeText={this.onChangeTextLimitHandler}
            value={limit} keyboardType="number-pad"/>
            <Text style={{width:"70%"}}>Kategoria</Text>
            <Picker onValueChange={(itemValue) =>
               this.setState({sport_id:itemValue})}
               selectedValue={sport_id}
               style={{width:Dimensions.get('window').width*0.7, backgroundColor:'white'}}>
                    <Picker.Item label="<Wybierz>" value={null}/>
             {sports.map(item => <Picker.Item label={item.value} value={item.id} key={item.id}/>)}
            </Picker>
            <CustomTextInput label="Opis" onChangeText={this.onChangeTextDescriptionHandler}
            value={description} multilines={true} numberOfLines={4}/>
            <CustomTextInput label="Koszt na osobę" onChangeText={this.onChangeTextCostHandler}
            value={costOnPerson}/>
            <Button size="medium" text="Dodaj" onPress={this.onPressAddButton}/>
        </ScrollView>)
    }
}

const styles = StyleSheet.create({
    FormPanel: {
        paddingTop:20,
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:"center",
        position: "absolute",
        width: Dimensions.get('window').width,
        backgroundColor:"#e6e6e6",
        paddingBottom:20,

    }
})