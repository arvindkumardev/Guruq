import { KeyboardAvoidingView, Text, View, ScrollView, Platform, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomCheckBox, Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts, Images } from '../../../../theme';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import { GET_BUSINESS_DETAILS_DATA } from './business.query';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import routeNames from '../../../../routes/screenNames';

function BusinessDetails() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [legalName, setLegalName] = useState('');
  const [businessData, setBusinessData] = useState({});
  const [registrationDate, setRegistrationDate] = useState();

  const [getBusinessDetails, { loading: businessLoading }] = useLazyQuery(GET_BUSINESS_DETAILS_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data.getTutorBusinessDetails.businessDetails) {
        setBusinessData(data.getTutorBusinessDetails.businessDetails);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getBusinessDetails();
    }
  }, [isFocussed]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ android: '', ios: 'padding' })}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? (isDisplayWithNotch() ? 44 : 20) : 0}
      enabled>
      {/* <Loader isLoading={saveBankDetailLoading} /> */}
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <Loader isLoading={businessLoading} />
        <ScreenHeader
          homeIcon
          label="Business Details"
          horizontalPadding={RfW(16)}
          lineVisible={false}
          rightText="EDIT"
          showRightText={Object.keys(businessData).length > 0}
          onRightTextClick={() =>
            navigation.navigate(routeNames.TUTOR.ADD_EDIT_BUSINESS_DETAILS, { businessDetails: businessData })
          }
        />
        <ScrollView contentContainerStyle={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          {Object.keys(businessData).length > 0 ? (
            <View>
              <View>
                <Text style={commonStyles.mediumMutedText}>PAN Number</Text>
                <Text>{businessData?.panNumber}</Text>
              </View>
              <View style={{ height: RfH(24) }} />
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
                  Are you eligible for GST
                </Text>
                <CustomCheckBox enabled={businessData?.gstEligible} />
              </View>
              <View style={{ height: RfH(24) }} />
              <View>
                <Text style={commonStyles.mediumMutedText}>GSTIN</Text>
                <Text>{businessData?.gstNumber}</Text>
              </View>
              <View style={{ height: RfH(24) }} />
              <View>
                <Text style={commonStyles.mediumMutedText}>Legal Name</Text>
                <Text>{businessData?.businessName}</Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, paddingTop: RfH(70), alignItems: 'center' }}>
              <Image
                source={Images.empty_cart}
                style={{
                  height: RfH(264),
                  width: RfW(248),
                  marginBottom: RfH(32),
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  commonStyles.pageTitleThirdRow,
                  { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
                ]}>
                No data found
              </Text>
              <Text
                style={[
                  commonStyles.regularMutedText,
                  { marginHorizontal: RfW(60), textAlign: 'center', marginTop: RfH(16) },
                ]}>
                Looks like you haven't provided your business details.
              </Text>
              <Button
                onPress={() =>
                  navigation.navigate(routeNames.TUTOR.ADD_EDIT_BUSINESS_DETAILS, { businessDetails: businessData })
                }
                style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
                <Text style={commonStyles.textButtonPrimary}>Add Business Details</Text>
              </Button>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default BusinessDetails;
