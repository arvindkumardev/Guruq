import React, {useState,useRef}from 'react'
import {Text, View,StyleSheet,CheckBox,Pressable,TouchableOpacity,useWindowDimensions,ScrollView } from 'react-native'
import PropTypes from 'prop-types';
import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import { RFValue } from 'react-native-responsive-fontsize';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import HTML  from 'react-native-render-html'
import { WebView } from 'react-native-webview';




const PTOptionsView=(props)=>{
    const {submission,answers,handleMarkAnswer,handleNext,handlePrevious,handleSubmit,currentQuestion,maxQuestion,question}= props
    const optionOneRef = useRef(null);
    const optionTwoRef = useRef(null);
    const optionThreeRef = useRef(null);
    const optionFourRef = useRef(null);
    const [optionone,setOptionOne]=useState(false)
    const [optiontwo,setOptionTwo]=useState(false)
    const [optionThree,setOptionThree]=useState(false)
    const [optionFour,setOptionFour]=useState(false)
    React.useEffect(() => {
        setOptionOne(answers[0].id===submission);
        setOptionTwo(answers[1].id===submission);
        setOptionThree(answers[2].id===submission);
        setOptionFour(answers[3].id===submission);
    }, [answers])
    const contentWidth = useWindowDimensions().width;
    return (
        <View>
        <View style={styles.questionView}>
        <Text style={styles.questionHeadingText}>Question {currentQuestion} Of {maxQuestion}</Text>
           <View style={styles.questionContainer}>
                <HTML 
                 tagsStyles={{p:{ color: Colors.black,fontSize:RFValue(22, STANDARD_SCREEN_SIZE)}}}
                source={{ html: question }} contentWidth={contentWidth} />
                </View>
     
               <TouchableOpacity
               style={styles.optionView}
           
                     activeOpacity={1}
                     onPress={() =>{
                     optionOneRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange()
                     }}
               >
               <CheckBox
               ref={optionOneRef}
                    value={optionone}
                    tintColors={{ true: '#005CC8', false: 'black' }}
                    onValueChange={()=>{  
                        handleMarkAnswer(answers[0])
                        setOptionOne(!optionone)
                        setOptionTwo(false)
                        setOptionThree(false)
                        setOptionFour(false)
                    }}                 
                    
                    style={styles.checkboxView}></CheckBox>
             
                    <HTML
                    tagsStyles={{p:{ color: Colors.black,fontSize:RFValue(18, STANDARD_SCREEN_SIZE)}}}
                     containerStyle={styles.optionText}
                    source={{ html: answers[0].text}} 
                    ></HTML>
                    </TouchableOpacity>
                    <TouchableOpacity
               style={styles.optionView}
           
                     activeOpacity={1}
                     onPress={() =>{
                     optionTwoRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange()
                     }}
               >
                <CheckBox
                ref={optionTwoRef}
                    value={optiontwo}
                    tintColors={{ true: '#005CC8', false: 'black' }}
                    onValueChange={()=>{
                        handleMarkAnswer(answers[1])
                        setOptionOne(false)
                        setOptionTwo(!optiontwo)
                        setOptionThree(false)
                        setOptionFour(false)
                    }}                 
                    style={styles.checkboxView}></CheckBox>
   
                    <HTML
                    tagsStyles={{p:{ color: Colors.black,fontSize:RFValue(18, STANDARD_SCREEN_SIZE)}}}
                     containerStyle={styles.optionText}
                    source={{ html: answers[1].text}} 
                    ></HTML>
        </TouchableOpacity>
        <TouchableOpacity
               style={styles.optionView}
           
                     activeOpacity={1}
                     onPress={() =>{
                     optionThreeRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange()
                     }}
               >
                <CheckBox
                     ref={optionThreeRef}
                     tintColors={{ true: '#005CC8', false: 'black' }}
                    value={optionThree}
                    onValueChange={()=>{
                        handleMarkAnswer(answers[2])
                        setOptionOne(false)
                        setOptionTwo(false)
                        setOptionThree(!optionThree)
                        setOptionFour(false)
                    }}                 
                    style={styles.checkboxView}></CheckBox>
                              
                    <HTML
                    tagsStyles={{p:{ color: Colors.black,fontSize:RFValue(18, STANDARD_SCREEN_SIZE)}}}
                     containerStyle={styles.optionText}
                    source={{ html: answers[2].text}} 
                    ></HTML>
        </TouchableOpacity>
        <TouchableOpacity
               style={styles.optionView}
           
                     activeOpacity={1}
                     onPress={() =>{
                     optionFourRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange()
                     }}
               >
                <CheckBox
                    ref={optionFourRef}
                    tintColors={{ true: '#005CC8', false: 'black' }}
                    value={optionFour}
                    onValueChange={()=>{
                        handleMarkAnswer(answers[3])
                        setOptionOne(false)
                        setOptionTwo(false)
                        setOptionThree(false)
                        setOptionFour(!optionFour)
                    }}                 
                    style={styles.checkboxView}></CheckBox>
                               
                    <HTML
                    tagsStyles={{p:{ color: Colors.black,fontSize:RFValue(18, STANDARD_SCREEN_SIZE)}}}
                     containerStyle={styles.optionText}
                    source={{ html: answers[3].text}} 
                    ></HTML>
        </TouchableOpacity>

      
        </View>
        <View style={styles.buttonView}>
                     <TouchableOpacity
                     hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                     activeOpacity={1}
                     onPress={() =>handlePrevious()}
                     >
                  <Text style={styles.buttonLeft}>Previous</Text>
                  </TouchableOpacity>
                  {currentQuestion==maxQuestion?<TouchableOpacity
                  activeOpacity={1}
                  hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    onPress={() =>handleSubmit()}>
                  <Text style={styles.buttonRight}>Submit</Text>
                </TouchableOpacity>:
                <TouchableOpacity
                  activeOpacity={1}
                  hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    onPress={() =>{
                        setOptionOne(false)
                        setOptionTwo(false)
                        setOptionThree(false)
                        setOptionFour(false)
                        handleNext()}}>
                  <Text style={styles.buttonRight}>Next</Text>
                </TouchableOpacity>
              }
              </View>
        </View>

    )




}
const styles = StyleSheet.create({

  
   
    childView:{
        flex:1,
        
    },
    
    questionView:{
        marginHorizontal:RfW(16),
        marginVertical:RfH(16),
        backgroundColor:Colors.white,
        width:'90%',  
        borderRadius:8,
        paddingHorizontal:RfW(16),
        paddingBottom:RfH(32),
        flexDirection:'column'
       
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
       
        flexShrink: 1,justifyContent:'center'
    },
    checkboxView:{
        marginRight:RfH(16),
        alignSelf:'center',
        color:"#005CC8"
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
        left:16
    },
    buttonRight:{
        position:'relative',
        backgroundColor:Colors.brandBlue2,
        borderRadius:8,
        fontSize:16,
        color:Colors.white,
        paddingHorizontal:RfW(16),
        paddingVertical:RfH(8),
        right:16
    }
    
    
    
    })


export default PTOptionsView