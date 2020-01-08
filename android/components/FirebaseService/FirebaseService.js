import {firebase} from '@react-native-firebase/firestore'
import {firebase as auth } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-community/google-signin';
import { Alert } from 'react-native';

class FirebaseService{
    uidVal;
    constructor(){
        this.observeAuth();
        this.getauid();
    }

    observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = async user => {
        if (!user) {
          try {
            const userInfo = await GoogleSignin.signInSilently();
            const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
            this.uidVal = firebaseUserCredential.user.uid;
          } catch ({ message }) {
            alert(message);
          }
        }
      };

      getauid = ()=>{
        this.uidVal = (firebase.auth().currentUser || {}).uid;
      }

      get uid() {
        return this.uidVal = (firebase.auth().currentUser || {}).uid;//this.uidVal;
      }
    
      get ref() {
        return firebase.firestore().collection('messages');
      }

      get eventRef() {
        return firebase.firestore().collection('events');
      }

      get participantsRef(){
        return firebase.firestore().collection('participants');
      }
      
      get sportsRef() {
        return firebase.firestore().collection('sports');
      }

      get fieldPath(){
        return firebase.firestore.FieldPath;
      }

      getUserByUid=(uid)=>{
        return firebase.firestore().collection('users').where('uid','==',uid);
      }

      parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot;
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
          _id,
          timestamp,
          text,
          user,
        };
        return message;
      };
    
      on = callback =>
        this.ref.limit(20).onSnapshot(querySnapshot =>{
          
          querySnapshot.docChanges().forEach((change) =>{
            if(change.type === 'added'){
              const result = change.doc.data();
              callback(this.parse(result));
            }
          })

        } );
    
      get timestamp() {
        return firebase.firestore.Timestamp.now();
      }
      // send the message to the Backend
      send = (messages) => {
        for (let i = 0; i < messages.length; i++) {
          const { text, user } = messages[i];
          
          const message = {
            text,
            user,
            timestamp: this.timestamp.toMillis(),
          };
          this.append(message);
        }
      };
    
      append = message => this.ref.add(message);

      addEvent = event => this.eventRef.add(event);

      joinToEvent = item => this.participantsRef.add(item);

      isTakePartInEvent = (uid, eventId) => this.participantsRef
      .where('uid', '==',uid).where('eventId','==', eventId).where('isAccepted','==', true);

      findAllUserEvents = (uid) => this.participantsRef
      .where('uid', '==',uid);

      findAllParticipientsEvents = (eventId) => this.participantsRef
      .where('eventId', '==',eventId);

      updateParticipient = (item, id) =>{
        this.participantsRef.doc(id).update({isAccepted:item.isAccepted});
      }
    
    }


    
    FirebaseService.shared = new FirebaseService();
    export default FirebaseService;