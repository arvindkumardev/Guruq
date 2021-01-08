import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { isEmpty } from 'lodash';
import { Images } from '../../theme';

import Colors from '../../theme/colors';
import { RfH, RfW } from '../../utils/helpers';
import { CustomCheckBox, Loader, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { UPDATE_BACKGROUND_CHECK } from './certification-mutation';
import { GET_TUTOR_LEAD_DETAIL } from './certification-query';
import { BackgroundCheckStatusEnum } from '../common/enums';
import { DASHBOARD_URL } from '../../utils/constants';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails } from '../../apollo/cache';
import ActionModal from './components/helpSection';

function BackgroundCheck() {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [consentCheckBox, setConsentCheckBox] = useState(false);
  const [tncCheckBox, setTncCheckBox] = useState(false);
  const [backgroundStatus, setBackgroundStatus] = useState('');
  const [openMenu, setOpenMenu] = useState(false);

  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
      }
    },
  });

  const [getTutorLeadDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_LEAD_DETAIL, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setBackgroundStatus(data.getTutorLeadDetails.backgroundCheck.status);
        getCurrentTutor();
      }
    },
  });

  const [updateBackgroundCheck, { loading: updateBackgroundCheckLoading }] = useMutation(UPDATE_BACKGROUND_CHECK, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        getTutorLeadDetails();
      }
    },
  });

  const onClick = () => {
    updateBackgroundCheck();
  };

  useEffect(() => {
    if (isFocussed) {
      getTutorLeadDetails();
    }
  }, [isFocussed]);

  return (
    <>
      <Loader isLoading={updateBackgroundCheckLoading || tutorLeadDetailLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0, flex: 1 }]}>
        <ScreenHeader
          showRightIcon
          rightIcon={Images.vertical_dots_b}
          onRightIconClick={() => setOpenMenu(true)}
          label="Background Verification"
          horizontalPadding={RfW(8)}
          homeIcon
        />

        {backgroundStatus === BackgroundCheckStatusEnum.NOT_STARTED.label && (
          <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(20) }}>
            <View
              style={{
                borderWidth: RfW(2),
                borderColor: Colors.lightGrey,
                borderRadius: RfH(8),
                height: RfH(450),
                marginBottom: RfH(15),
                // padding: RfH(5),
              }}>
              <Text />
              <WebView
                source={{
                  uri: `${DASHBOARD_URL}/terms`,
                }}
                javaScriptEnabled
                domStorageEnabled
                showsVerticalScrollIndicator={false}
              />
            </View>

            <TouchableOpacity
              onPress={() => setTncCheckBox(!tncCheckBox)}
              style={[commonStyles.horizontalChildrenView, { alignItems: 'center' }]}
              activeOpacity={0.8}>
              <CustomCheckBox enabled={tncCheckBox} submitFunction={() => setTncCheckBox(!tncCheckBox)} />
              <Text style={[commonStyles.mediumPrimaryText, { marginLeft: RfW(16) }]}>
                I have read the GuruQ Terms & Conditions, Privacy Policy and Cookie Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConsentCheckBox(!consentCheckBox)}
              style={[commonStyles.horizontalChildrenView, { alignItems: 'center', marginTop: RfH(16) }]}
              activeOpacity={0.8}>
              <CustomCheckBox enabled={consentCheckBox} submitFunction={() => setConsentCheckBox(!consentCheckBox)} />
              <Text style={[commonStyles.mediumPrimaryText, { marginLeft: RfW(16) }]}>
                I agree to a background check by GuruQ team to verify my credentials.
              </Text>
            </TouchableOpacity>

            <View style={{ marginTop: RfH(40) }}>
              <Button
                onPress={onClick}
                style={[
                  !consentCheckBox || !tncCheckBox ? commonStyles.disableButton : commonStyles.buttonPrimary,
                  { alignSelf: 'center' },
                ]}
                disabled={!consentCheckBox || !tncCheckBox}>
                <Text style={commonStyles.textButtonPrimary}>Confirm</Text>
              </Button>
            </View>
          </View>
        )}

        {!isEmpty(backgroundStatus) && backgroundStatus !== BackgroundCheckStatusEnum.NOT_STARTED.label && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={commonStyles.headingPrimaryText}>{`Your background status is ${
              backgroundStatus && backgroundStatus.replace('_', ' ').toLowerCase()
            }`}</Text>
            <View style={{ marginTop: RfH(20) }}>
              <Button
                onPress={() => getTutorLeadDetails()}
                style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
                <Text style={commonStyles.textButtonPrimary}>Check Status</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} />}
    </>
  );
}

export default BackgroundCheck;
