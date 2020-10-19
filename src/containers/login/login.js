import { View, Text, TouchableOpacity, Keyboard,  TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useRef, useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../utils/constants';
import {CustomMobileNumber} from '../../components';
import routeNames from '../../routes/ScreenNames';

function login() {
    const navigation = useNavigation();
    const [showNext, setShowNext] = useState(false);
    const [mobileObj, setMobileObj] = useState({ mobile: '', country:IND_COUNTRY_OBJ })

    const onBackPress = () =>{
        navigation.goBack();
    }


    const onSubmitEditing = () =>{
        setShowNext(true);
    }

    const onClickContinue = () =>{
        navigation.navigate(routeNames.OTP_VERIFICATION);
    }

    const bottonView = () =>{
        return(
            <KeyboardAvoidingView>
                <View style={{backgroundColor:Colors.white, paddingHorizontal:16, paddingVertical:56, borderTopLeftRadius:25, borderTopRightRadius:25}}>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', }}>
                        <View>
                            <CustomMobileNumber
                                value={mobileObj}
                                topMargin={0}
                                onChangeHandler={(mobileObj) => {setMobileObj(mobileObj)}}
                                returnKeyType={'done'}
                                refKey={'mobileNumber'}
                                placeholder={'Mobile number'}
                                onSubmitEditing={() => onSubmitEditing()}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => onClickContinue()} style={[(showNext ? commonStyles.buttonPrimary:commonStyles.disableButton),{marginTop:RfH(107), alignSelf:'center', width:RfW(144)}]}>
                        <Text style={commonStyles.textButtonPrimary}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

  return (
    <View style={[commonStyles.mainContainer,{backgroundColor: Colors.onboardBackground}]}>
        <Icon onPress={() => onBackPress()} type='MaterialIcons' name='keyboard-backspace' style={{marginLeft:16, marginTop:58, color:Colors.white}}/>
        <View style={{flex:1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{flex:1}}></View>
        </TouchableWithoutFeedback>
        </View>
      <KeyboardAvoidingView behavior={'padding'}>
        <View style={{flexDirection:'column', alignItems:'stretch'}}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{marginTop:RfH(36)}}>
                    <Text style={styles.title}>Login/ Sign Up</Text>
                    <Text style={styles.subtitle}>Enter your phone number to continue</Text>
                </View>
            </TouchableWithoutFeedback>
            {bottonView()}
        </View>
        </KeyboardAvoidingView>
    </View>
  );
}

export default login;
