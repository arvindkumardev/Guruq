import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomCheckBox, Loader, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { GET_BUSINESS_DETAILS_DATA } from './business.query';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import routeNames from '../../routes/screenNames';

function BusinessDetails() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [businessData, setBusinessData] = useState({});
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  const [getBusinessDetails, { loading: businessLoading }] = useLazyQuery(GET_BUSINESS_DETAILS_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setBusinessData(data.getTutorBusinessDetails.businessDetails);
        setIsDataEmpty(!data?.getTutorBusinessDetails?.businessDetails);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getBusinessDetails();
    }
  }, [isFocussed]);

  return (
    <>
      <Loader isLoading={businessLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader
          homeIcon
          label="Business Details"
          horizontalPadding={RfW(16)}
          rightText="EDIT"
          showRightText={!isEmpty(businessData)}
          onRightTextClick={() =>
            navigation.navigate(routeNames.TUTOR.ADD_EDIT_BUSINESS_DETAILS, { businessDetails: businessData })
          }
        />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          {!isDataEmpty ? (
            <>
              {!isEmpty(businessData) && (
                <View>
                  <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, paddingVertical: RfH(8) }}>
                    <Text style={commonStyles.mediumMutedText}>PAN Number</Text>
                    <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(5) }]}>
                      {businessData?.panNumber}
                    </Text>
                  </View>
                  <View style={{ height: RfH(24) }} />
                  <View style={{ paddingVertical: RfH(8) }}>
                    <View style={commonStyles.horizontalChildrenSpaceView}>
                      <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
                        Are you eligible for GST
                      </Text>
                      <CustomCheckBox enabled={businessData?.gstEligible} />
                    </View>
                  </View>
                  <View style={{ height: RfH(24) }} />
                  <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, paddingVertical: RfH(8) }}>
                    <Text style={commonStyles.mediumMutedText}>GSTIN</Text>
                    <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(5) }]}>
                      {businessData?.gstNumber}
                    </Text>
                  </View>
                  <View style={{ height: RfH(24) }} />
                  <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, paddingVertical: RfH(8) }}>
                    <Text style={commonStyles.mediumMutedText}>Legal Name</Text>
                    <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(5) }]}>
                      {businessData?.businessName}
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={{ flex: 1, paddingTop: RfH(30), alignItems: 'center' }}>
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
        </View>
      </View>
    </>
  );
}

export default BusinessDetails;
