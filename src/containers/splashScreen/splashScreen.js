import { View, Image, Text } from 'react-native';
import React, { useEffect } from 'react';
import styles from '../../common/styles';
import { Colors } from '../../theme';
import { RfH, RfW, getSaveData, getToken } from '../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import routeNames from '../../routes/ScreenNames';
import { useNavigation } from '@react-navigation/native';


function splashScreen() {
    const navigation = useNavigation();

    useEffect(() =>{
        checkRoute();
    })

    const checkRoute = async () =>{
        const isOnBoardingShown = await getSaveData(LOCAL_STORAGE_DATA_KEY.ONBOARDING_SHOWN);
        if(!isOnBoardingShown){
            navigation.navigate(routeNames.ONBOARDING);
        }else{
            const token = await getToken();
            if(token){
                navigation.navigate(routeNames.USER_ONBOARDING);
            }else{
                navigation.navigate(routeNames.LOGIN);
            }
        }
    } 
  return (
    <View style={[styles.mainContainer, {backgroundColor: Colors.onboardBackground}]}>
      <Image style={{height:233, width:233, marginTop:RfH(179), marginHorizontal:RfW(71), alignSelf:'center'}} source={require('../../assets/images/splash_image.png')}></Image>
      <Text style={{fontSize:20, color:'#fff', fontWeight:'500', alignSelf:'center', marginTop:RfH(-40)}}>Find the best</Text>
      <Text style={{fontSize:20, color:'#fff', fontWeight:'500', alignSelf:'center'}}>Tutors and Institutes</Text>
      <Text style={{fontSize:14, color:'#fff', opacity:0.5, textAlign:'center', bottom:RfH(48), left:0, right:0, position:'absolute'}}>Powered by RHA Technologies</Text>
    </View>
  );
}

export default splashScreen;
