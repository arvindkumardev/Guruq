import React, { Component } from 'react';
import { View, Text ,Dimensions} from 'react-native';
import DatePicker from 'react-native-datepicker'
const {height, width} = Dimensions.get('window');
import moment from 'moment'
export default class DateTimesPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date:'03-01-2020',
        datetime:'23rd January 2020, 1:16:52 pm',
        disabled:false,
       //  dateExtra: moment(new Date()).format("YYYY-MM-DD,h:mm:ss a"),
    };
  }

// date picker
openDatePicker=()=>{
    this.setState({
      disabled:true
    })
  }
  onCloseDatePicker=()=>{
    this.setState({
        disabled:false
      })
  }
  // _onDateChange=(date,datetime,dateExtra)=>{
  //   console.log(date)
  //   // console.log(new Date(date).toISOString())
  //   this.setState({
  //       date: date,
  //     //  datetime:datetime,
        
  //   })
  //     }
  render() {
    return (
    
        <DatePicker
        style={{width:width/1.2}}
        date={this.props.date}
        showIcon={false}
        mode={ this.props.dates}
        allowFontScaling={false}
       // TouchableComponent={TouchableOpacity}
       is24Hour={true}
        placeholder="select date"
        format={this.props.formate }
        minDate={this.props.minDateTime }
        maxDate={this.props.maxDateTime }
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onOpenModal={this.openDatePicker}
        onCloseModal={this.onCloseDatePicker}
        customStyles={{
          dateText:{
            color:"#FFFFFF"
          },
          dateIcon: {
           // position: 'absolute',
          //  left: 0,
          // top: 4,
          //  marginLeft: 0
          
         
          },
         dateInput: {
          // marginLeft: 36,
          alignItems:"flex-start",
           borderWidth:null,
         //  backgroundColor:'red'
         
         
         }
        //  ... You can check the source to find the other keys.
       }}
        onDateChange={this.props._onDateChange}
      />
      
    );
  }
}
