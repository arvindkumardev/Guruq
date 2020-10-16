import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Input } from 'native-base';
import React, { useRef } from 'react';
import {useNavigation} from '@react-navigation/native';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH } from '../../utils/helpers';
import PhoneInput from 'react-native-phone-input';

function login() {
    const navigation = useNavigation();
    const phoneInput = useRef();

    onBackPress = () =>{
        navigation.goBack();
    }

    const bottonView = () =>{
        return(
        <View style={{backgroundColor:Colors.white, paddingHorizontal:16, paddingVertical:56, borderTopLeftRadius:25, borderTopRightRadius:25}}>
            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', borderBottomColor:Colors.inputLabel, borderBottomWidth:0.5}}>
                <View style={{flex:0.3}}>
                    <PhoneInput initialCountry={'us'} style={{marginVertical:RfH(14)}} ref={phoneInput}/>
                </View>
                <View style={{backgroundColor:Colors.inputLabel, width:1}}><Text style={{color:Colors.inputLabel}}>.</Text></View>
                <View style={{flex:0.7, paddingHorizontal:16}}>
                    <Input placeholder='Mobile Number' placeholderTextColor={Colors.inputLabel} />
                </View>
            </View>
            <TouchableOpacity style={[commonStyles.disableButton,{marginTop:RfH(63.5), alignSelf:'center'}]}>
                <Text style={commonStyles.textButtonPrimary}>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
        );
    }

  return (
    <View style={[commonStyles.mainContainer,{backgroundColor: Colors.onboardBackground}]}>
        <Icon onPress={() => onBackPress()} type='MaterialIcons' name='keyboard-backspace' style={{marginLeft:16, marginTop:58, color:Colors.white}}/>
        <View style={{bottom:0, position:'absolute', right:0, left:0}}>
            <Text style={styles.title}>Login/ Sign Up</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue</Text>
            {bottonView()}
        </View>
    </View>
  );
}

export default login;
