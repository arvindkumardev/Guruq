import React,{useEffect} from 'react'
import {Text,View,BackHandler} from 'react-native'
import { RfH, RfW } from '../../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { PtStatus } from '../../tutor/enums';
import { Colors,Images } from '../../../theme';
import { ScreenHeader } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';
const TestResult=(props)=>{
    const { route } = props;
    const navigation = useNavigation();
    const data = route?.params?.data;
    const ptDetail=data.checkPTResponse;





    function handleBackButtonClick() {
        navigation.navigate(NavigationRouteNames.TUTOR.PT_START_SCREEN)
        return true;
      }
        useEffect(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
              BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
          }, []);
        return (
            <View>
            <ScreenHeader
            label="Test Results"
            horizontalPadding={RfW(16)}
            homeIcon
            handleBack={() => navigation.navigate(NavigationRouteNames.TUTOR.PT_START_SCREEN)}
          />
        <View style={{ marginTop: RfH(50),marginHorizontal:RfW(20) }}>
        
            <Text style={[commonStyles.headingPrimaryText, { textAlign: 'center' }]}>
              Total Score {ptDetail?.score} (out of {ptDetail?.maxMarks})
            </Text>
            <View style={{ marginTop: RfH(30) }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(10),
                }}>
                <Text style={commonStyles.regularPrimaryText}>Correct</Text>
                <View
                  style={{
                    paddingVertical: RfH(10),
                    paddingHorizontal: RfW(30),
                    borderWidth: RfH(0.5),
                    borderRadius: RfH(8),
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <Text style={commonStyles.regularPrimaryText}>{ptDetail?.score}</Text>
                </View>
              </View>
      
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(10),
                }}>
                <Text style={commonStyles.regularPrimaryText}>Incorrect</Text>
                <View
                  style={{
                    paddingVertical: RfH(10),
                    paddingHorizontal: RfW(30),
                    borderWidth: RfH(0.5),
                    borderRadius: RfH(8),
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <Text style={commonStyles.regularPrimaryText}>
                    {ptDetail?.maxMarks - ptDetail?.score - ptDetail?.notAttempted}
                  </Text>
                </View>
              </View>
      
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(10),
                }}>
                <Text style={commonStyles.regularPrimaryText}>Not Attempted</Text>
                <View
                  style={{
                    paddingVertical: RfH(10),
                    paddingHorizontal: RfW(30),
                    borderWidth: RfH(0.5),
                    borderRadius: RfH(8),
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <Text style={commonStyles.regularPrimaryText}>{ptDetail?.notAttempted}</Text>
                </View>
              </View>
      
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(10),
                }}>
                <Text style={commonStyles.regularPrimaryText}>Total</Text>
                <View
                  style={{
                    paddingVertical: RfH(10),
                    paddingHorizontal: RfW(30),
                    borderWidth: RfH(0.5),
                    borderRadius: RfH(8),
                    width: '28%',
                    alignItems: 'center',
                  }}>
                  <Text style={commonStyles.regularPrimaryText}>{ptDetail?.maxMarks}</Text>
                </View>
              </View>
      
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(10),
                }}>
                <Text style={commonStyles.regularPrimaryText}>Result</Text>
                <View
                  style={{
                    paddingVertical: RfH(10),
                    paddingHorizontal: RfW(30),
                    borderWidth: RfH(0.5),
                    borderRadius: RfH(8),
                    width: '28%',
                    alignItems: 'center',
                    backgroundColor: ptDetail?.status === PtStatus.PASSED.label ? Colors.green : Colors.orangeRed,
                  }}>
                  <Text style={[commonStyles.regularPrimaryText, { color: Colors.white }]}>
                    {ptDetail?.status === PtStatus.PASSED.label ? 'PASS' : 'FAIL'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          </View>
        )

            // return (
            //     <View>
            //         <Text>Result</Text>
            //     </View>


            // )
}






export default TestResult