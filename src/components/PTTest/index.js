import React, {useState,useEffect}from 'react'
import {Text, View,StyleSheet,CheckBox,Pressable,TouchableOpacity,useWindowDimensions,ScrollView } from 'react-native'
import PropTypes from 'prop-types';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import HTML  from 'react-native-render-html'
import { WebView } from 'react-native-webview';
import PTOptionsView from '../../components/PTOptionsView'
import  moment from 'moment';
const PTTestView=(props)=>{
    const [currentQuestion,setCurrentQuestion]=useState(1)
    const [counter, setCounter] = useState(1);
    const [timeRemaining,setTimeRemaining]=useState();
    const [endDateTime, setEndDateTime] = useState(moment().add(30, 'minutes').valueOf());
  
   var timer;
    const totalTime = 30 * 60;
    const {
        ptQuestions,
        ptDetails,
        offeringId,
        handleSubmit
      } = props;
      
      const getTimeString = () => {
        if (endDateTime > 0) {
      
          const t = getTime();
          setTimeRemaining( `${Math.floor(t / 60)}:${Math.floor(t % 60)}`);
        }
      };
      const getTime = () => {
        if (endDateTime > 0) {
           let value=parseInt((endDateTime - moment().valueOf()) / 1000)
 
            if(value==0)
            {
                
                    onSubmit()
                    return 0.0
            }
            if(parseInt(((endDateTime - moment().valueOf())) / 1000)>0)
            {
                return (endDateTime - moment().valueOf()) / 1000;
            }
            return 0.0
        }
      };
      //var timer ;
      useEffect(()=>{
    
        timer=setInterval(function(){
                setCounter(counter + 1)
               getTimeString()
               }, 1000)
           
           return function cleanup(){
               clearInterval(timer)
           }
    
      },[])
  
    



    let maxQuestion= ptQuestions.length;
  
   
      let temp=[]
    ptQuestions.map((question)=> {
            temp.push({questionId:question.id,answers:[]})
        })
    const [response,setResponse]=useState({"tutorOfferingId":offeringId,tutorPtId:ptDetails.id,submissions:temp})
    const handleNext=()=>
    {
        //maniuplate the submission
      if(currentQuestion<maxQuestion)
        {
            setCurrentQuestion(currentQuestion+1)
        }
    }
    const handlePrevious=()=>{

        if(currentQuestion!=1)
        {
            setCurrentQuestion(currentQuestion-1)
        }

    }
    const onSubmit=()=>{
     
        clearInterval(timer)
     
        const checkPTDto = {
            tutorOfferingId: parseFloat(response.tutorOfferingId),
            tutorPtId: parseFloat(response.tutorPtId),
            submissions: response.submissions,
            timeTaken: totalTime - counter,
          };
     
          handleSubmit(checkPTDto)
    }

  
  const handleMarkAnswer=(answer)=>{
            let temp=response
            if(temp.submissions[currentQuestion-1].answers.length>0)
            {
                if(temp.submissions[currentQuestion-1].answers[0]==answer.id)
                {
                    temp.submissions[currentQuestion-1].answers.pop()
                }
                else{
                    temp.submissions[currentQuestion-1].answers[0]=answer.id
                }
            }
            else{
                temp.submissions[currentQuestion-1].answers[0]=answer.id
            }
           setResponse(temp)
           console.log("Response is ",JSON.stringify(response))
           
        }
        const getCurrentSubmission=()=>{
            if(response.submissions[currentQuestion-1].answers.length>0)
            {
                return  response.submissions[currentQuestion-1].answers[0]
            }
            else{
                return null
            }

        }
       
     




    return (
        <>
        <ScrollView style={{ marginBottom:RfH(16) }}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                
            <View style={styles.mainView}>
                <View>
                <Text style={styles.headingtext}>Total Questions</Text>
                <Text style={styles.questionText}>{maxQuestion}</Text>
                </View>
                <View>
                <Text style={styles.headingtext}>Time Remaining</Text>
                <Text style={styles.timetext}>{timeRemaining}</Text>
                </View>
             </View>
             <PTOptionsView
                  question={ptQuestions[currentQuestion-1].question}
                  handleNext={handleNext}
                  currentQuestion={currentQuestion}
                  maxQuestion={maxQuestion}
                  handlePrevious={handlePrevious}
                  handleSubmit={onSubmit}
                  submission={getCurrentSubmission()}
                  handleMarkAnswer={handleMarkAnswer}
                    answers={ptQuestions[currentQuestion-1].answers}></PTOptionsView>
    
              
           
        
            
              </ScrollView>
        </>



    )

}

PTTestView.PropTypes={
    ptQuestions:PropTypes.array
}
PTTestView.defaultProps = {
    ptQuestions:[]
  };
const styles = StyleSheet.create({

mainView:{
    marginHorizontal:RfW(16),
    marginVertical:RfW(16),
    backgroundColor:Colors.white,
    width:'90%',  
    borderRadius:8,
    height:RfH(100),
    padding:RfH(8),
    flexDirection:'row',
    justifyContent: 'space-around',
},
childView:{
    flex:1,
    
},

questionView:{
    marginHorizontal:RfW(16),
    marginVertical:RfH(16),
    backgroundColor:Colors.white,
    width:'90%',  
    borderRadius:8,
    padding:RfH(8),
    flexDirection:'column'
   
},
headingtext:{
    fontSize:RFValue(18, STANDARD_SCREEN_SIZE),
    color:Colors.secondaryText,
},
questionHeadingText:{
    fontSize:RFValue(18, STANDARD_SCREEN_SIZE),
    color:Colors.secondaryText,
    position:'absolute',
    left:0,
    padding:RfH(16)
},
questionContainer:{
    marginTop:RfH(55),
    paddingHorizontal:RfH(8)
},
questionText:{
    fontSize:RFValue(24, STANDARD_SCREEN_SIZE),
    color:Colors.black,
    flexShrink: 1
},
questionStyle:{
    fontSize:RFValue(20, STANDARD_SCREEN_SIZE),
    color:Colors.black,
    flexWrap:'wrap',
    
},
timetext:{
    fontSize:RFValue(40, STANDARD_SCREEN_SIZE),
    color:Colors.black,
},
optionView:{

    marginTop:RfH(16),    
    flexDirection:'row'
},
optionText:{
    fontSize:RFValue(18, STANDARD_SCREEN_SIZE),
    color:Colors.lightBlack,
    flexShrink: 1
},
checkboxView:{
    marginRight:RfH(16),
    alignSelf:'center'
},
buttonView:{

    width:'100%',
    flexDirection:'row',
 
    alignSelf:'center',
    justifyContent:'space-between'

},
buttonLeft:{
    position:'relative',
    
    backgroundColor:Colors.brandBlue2,
    color:Colors.white,
    borderRadius:8,
    fontSize:16,
    paddingHorizontal:RfW(16),
    paddingVertical:RfH(8),
    left:8
},
buttonRight:{
    position:'relative',
    backgroundColor:Colors.brandBlue2,
    borderRadius:8,
    fontSize:16,
    color:Colors.white,
    paddingHorizontal:RfW(16),
    paddingVertical:RfH(8),
    right:8
}


})
export default PTTestView ;