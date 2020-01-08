import React, {Component} from 'react'
import DatePicker from 'react-native-datepicker'

export default class CustomDatePicker extends Component{
    constructor(){
        super();
    }

    render(){
        const {onChange, dateTime} = this.props;
        return(<DatePicker
            style={{width: 145}}
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
    onDateChange={onChange}
  />)
    }
}