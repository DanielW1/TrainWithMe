import React from 'react'
import {GiftedChat} from 'react-native-gifted-chat'

import FirebaseService from './../FirebaseService/FirebaseService'
  
 export default class Chat extends React.Component {
  static navigationOptions = {
    title: "Czat"
  };
    state = {
      messages: [],
      eventId:null,
    };

    componentDidMount() {
      let eventId = this.props.navigation.getParam('eventId');
      this.setState({eventId});
        FirebaseService.shared.on(message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      );
    }
    componentWillUnmount() {
       // FirebaseService.shared.off();
    }
  
    get user() {
      return {
        name: this.props.navigation.state.params.name,
        _id: FirebaseService.shared.uid,
        _event_id: this.props.navigation.getParam('eventId'),
      };
    }
  
    render() {
      const {eventId} = this.state;
      return (
        <GiftedChat
          messages={this.state.messages.filter(mess => eventId.localeCompare(mess.user._event_id) ==0)
            .sort((a, b)=> a.timestamp < b.timestamp)}
          onSend={FirebaseService.shared.send}
          user={this.user}
        />
      );
    }
  
  }
  
  