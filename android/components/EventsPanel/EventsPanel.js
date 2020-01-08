import React, {Component} from 'react'
import { FlatList, TextInput, ScrollView } from 'react-native-gesture-handler';
import FirebaseService from '../FirebaseService/FirebaseService';
import Card from '../Card/Card';
import { Alert, View, Dimensions, Picker, Text, Image, TouchableHighlight } from 'react-native';
import Button from './../Button'
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import LoadingPanel from '../LoadingPanel/LoadingPanel';

export default class EventsPanel extends Component {

constructor(){
    super();
    this.state = {
        events: [],
        f_events:[],
        sports:[],
        participants:[],
        filterMode:false,
        f_sport_id:null,
        f_date_from: null,
        f_date_to: null,
        f_cost_from: null,
        f_cost_to: null,
        showLoadingPanel:true,
        mode: null,
    }
}

componentDidMount = ()=>{
this.setState({events: [],
    f_events:[],
    sports:[],
    participants:[],
    filterMode:false,
    f_sport_id:null,
    f_date_from: null,
    f_date_to: null,
    f_cost_from: null,
    f_cost_to: null,
    showLoadingPanel:true,
    mode: null,})

    let mode = this.props.navigation.getParam('mode');
    this.setState({mode});
    FirebaseService.shared.sportsRef.get().then(docs =>{
        docs.forEach( doc =>{
            this.setState((state) => ({
            sports: state.sports.concat({sport_id:doc.id, value:doc.data()}) 
            }))
        })
    })

    if(mode =='all'){
        FirebaseService.shared.eventRef.get().then(docs =>{
            docs.forEach( doc =>{
                this.prepareEvents(doc);
            })
        })
    }else if(mode=='organized'){
        FirebaseService.shared.eventRef
        .where('organizer', '==',FirebaseService.shared.uid ).get().then(docs =>{
            docs.forEach( doc =>{
                this.prepareEvents(doc);
            })
        })
    }else if(mode == 'takePart'){
        let result = FirebaseService.shared.findAllUserEvents(FirebaseService.shared.uid);
        result.get().then(docs =>{
            docs.forEach(doc =>{
                this.setState((state)=>({participants: state.participants.concat(doc.data().eventId) }),this.func)
                
            })
        })
        
    }
    this.setState({showLoadingPanel:false})

//     FirebaseService.shared.eventRef.get().then(docs =>{
//         docs.forEach( doc =>{

//             let item = {id:doc.id,
//                  name: doc.data().name, 
//                  dateTime: doc.data().dateTime,
//                  cost: doc.data().costOnPerson,
//                  organizer: doc.data().organizer,
//                  category: this.state.sports.find( a => a.id = doc.data().sport_id).value,
//              }
             

//             this.setState((state) => ({
//                events: state.events.concat(item),
//             }))
//         })
//     }).catch(error => {
        
//     })
 }

 func = ()=>{
    FirebaseService.shared.eventRef.where(FirebaseService.shared.fieldPath.documentId(),'in',this.state.participants)
    .get().then(docs =>{
        docs.forEach( doc =>{
            this.prepareEvents(doc);
        })
    })
 }

prepareEvents = (doc)=>{
        
    let item = {id:doc.id,
        name: doc.data().name, 
        dateTime: doc.data().dateTime,
        cost: doc.data().costOnPerson,
        organizer: doc.data().organizer,
        sport_id: doc.data().sport_id,
        category: this.state.sports.find( a => a.sport_id == doc.data().sport_id).value,
    }
    

   this.setState((state) => ({
      events: state.events.concat(item),
      f_events:state.f_events.concat(item)
   }))
}

onCardPress = (item)=>{
    this.props.navigation.navigate('Event',{eventId: item.id});
}

onPressFilterButton=()=>{
    this.setState({filterMode:true})
}

onPressConfirmButton = ()=>{
    this.filterEvents();
    this.setState({filterMode:false})
}

onCloseFilterPress = ()=>{
    this.setState({filterMode:false});
}

onPressAddButton = ()=>{
    this.props.navigation.navigate('AddEvent');
}

filterEvents = () =>{
    const {events, f_cost_from, f_cost_to, f_date_to, f_date_from, f_sport_id, f_events} = this.state;

    let items = f_events.slice();
    //Alert.alert('',JSON.stringify(items));
    if(f_sport_id){
    items = items.filter(item => f_sport_id.localeCompare(item.sport_id) === 0);}
    items = items.filter(item =>{
       return  (item.dateTime.localeCompare(f_date_from)>=0 || !f_date_from) 
       && (!f_date_to || f_date_to.localeCompare(item.dateTime)>=0)
    });
    items = items.filter(item =>{
        return  (item.cost.localeCompare(f_cost_from)>=0 || !f_cost_from) 
        && (!f_cost_to || f_cost_to.localeCompare(item.cost)>=0)
     })


    this.setState({events:items});

}

onChangeDateFromHandler = (f_date_from)=>{
    this.setState({f_date_from});
}

onChangeDateToHandler = (f_date_to)=>{
    this.setState({f_date_to});
}

onChangeCostFromText=(f_cost_from)=>{
    this.setState({f_cost_from});
}

onChangeCostToText=(f_cost_to)=>{
    this.setState({f_cost_to});
}

renderItem = ( item ) => (

<Card item={item} onPress={()=>this.navigation.navigate("Event", {eventId:item.id})}/>
)

render(){
    const {events, filterMode, f_date_from, f_date_to,
         f_cost_from, f_cost_to,f_sport_id, sports, showLoadingPanel, mode} = this.state;
     //Alert.alert('Title',JSON.stringify(this.state.sports));
    return(
        <ScrollView>
            {!showLoadingPanel && !filterMode && <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                <Button size={"all".localeCompare(mode)== 0 ?"small":"medium"} text={"Filtruj"} onPress={this.onPressFilterButton}/>
                {"all".localeCompare(mode)== 0 && !filterMode && <Button size="small" text={"Dodaj"} onPress={this.onPressAddButton}/>} 
            </View>}
            {!filterMode && <><View>
                {events.map( item => <Card item={item} onPress={()=>this.onCardPress(item)}/>)}
            </View></>
            }
            {!showLoadingPanel && filterMode && <View style={{marginLeft:5, marginRight:5}}>
                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginTop:5} }>
                    <TouchableHighlight style={{width:30, height:30} } onPress={this.onCloseFilterPress}>
                        <Image style={{width:30, height:30}} source={require('./../../assets/Close-512.png')}/>
                    </TouchableHighlight>
                </View>
                <Text>Kategoria:</Text>
                <Picker onValueChange={(itemValue) =>
                    {this.setState({f_sport_id:itemValue})}}
                    selectedValue={f_sport_id}
                    style={{width:Dimensions.get('window').width*0.7, backgroundColor:'white'}}>
                            <Picker.Item label="<Wybierz>" value={null}/>
                    {sports.map(item => <Picker.Item label={item.value.name} value={item.sport_id} key={item.sport_id}/>)}
                </Picker>
                <Text>Data:</Text>
                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    <Text>Od:</Text>
                        <CustomDatePicker dateTime={f_date_from} onChange={this.onChangeDateFromHandler}/>
                    <Text>Do:</Text>
                        <CustomDatePicker dateTime={f_date_to} onChange={this.onChangeDateToHandler}/>
                </View>
                <Text>Koszt:</Text>
                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    <Text>Od:</Text>
                        <TextInput
                            onChangeText={(text)=>this.onChangeCostFromText(text)} 
                            value={f_cost_from}                          
                            keyboardType="number-pad"
                            style={{backgroundColor:'white', width:145}}/>
                    <Text>Do:</Text>
                    <TextInput
                            onChangeText={(text)=>this.onChangeCostToText(text)} 
                            value={f_cost_to}                          
                            keyboardType="number-pad"
                            style={{backgroundColor:'white', width:145}}/>
                </View>
                <Button size="medium" text={"Potwierdź"} onPress={this.onPressConfirmButton}/>
            </View>}
            {showLoadingPanel&&<LoadingPanel/>}
        </ScrollView>
        );
}
}