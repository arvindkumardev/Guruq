import { FlatList, Keyboard, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { CustomRadioButton, ScreenHeader, Loader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors } from '../../theme';
import { alertBox, getFullName, RfH, RfW } from '../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { CANCEL_CLASS, CANCEL_CLASS_REQUEST } from '../student/class.mutation';
import NavigationRouteNames from '../../routes/screenNames';
import { ClassCancelReasonEnum } from '../common/enums';
import { userDetails } from '../../apollo/cache';

function CancelReason(props) {
  const { route } = props;
  const navigation = useNavigation();
  const { classId, pastClass } = route.params;

  const userInfo = useReactiveVar(userDetails);

  const [cancelReason, setCancelReason] = useState('');
  const [reasons, setReasons] = useState(
    Object.values(ClassCancelReasonEnum).map((c) => {
      return { ...c, selected: false, isCustom: c.label === ClassCancelReasonEnum.OTHER.label };
    })
  );

  const [cancelClass, { loading: cancelLoading }] = useMutation(CANCEL_CLASS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        // const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Class cancelled successfully', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            navigation.navigate(NavigationRouteNames[userInfo.type].DASHBOARD, { tabId: 2 });
          },
        });
      }
    },
  });

  const [cancelClassRequest, { loading: cancelClassRequestLoading }] = useMutation(CANCEL_CLASS_REQUEST, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      // const error = e.graphQLErrors[0].extensions.exception.response;
      // }
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(
          'Class cancellation request is raised, please wait for GuruQ team to approve it and then you can reschedule the class.',
          '',
          {
            positiveText: 'Ok',
            onPositiveClick: () => {
              navigation.navigate(NavigationRouteNames[userInfo.type].DASHBOARD, { tabId: 2 });
            },
          }
        );
      }
    },
  });

  const onReasonChange = (index) => {
    if (!reasons[index].selected) {
      setReasons((reasons) =>
        reasons.map((reasonItem, reasonIndex) => ({ ...reasonItem, selected: reasonIndex === index }))
      );
      setCancelReason(reasons[index].isCustom ? '' : reasons[index].label);
    }
  };

  const renderReasons = (item, index) => (
    <TouchableOpacity onPress={() => onReasonChange(index)} activeOpacity={0.8}>
      <View style={commonStyles.horizontalChildrenView}>
        <CustomRadioButton enabled={item.selected} />
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>{item.displayName}</Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginVertical: RfH(16) }} />
    </TouchableOpacity>
  );

  const onCancelClass = () => {
    if (isEmpty(cancelReason)) {
      alertBox('Please provide the cancellation reason');
    } else if (pastClass) {
      cancelClassRequest({
        variables: {
          inquiryDto: {
            name: getFullName(userInfo),
            mobile: userInfo.phoneNumber.number,
            email: userInfo.email,
            title: `Class cancel request: C-${classId}`,
            text: cancelReason,
            source: 'APP',
            classEntity: { id: classId },
            type: 'SUPPORT',
            requestType: 'CLASS_CANCEL',
          },
        },
      });
    } else {
      cancelClass({
        variables: {
          classId,
          cancelReason,
          comments: String(cancelReason),
        },
      });
    }
  };

  return (
    <>
      <Loader isLoading={cancelLoading || cancelClassRequestLoading} />

      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <ScreenHeader label="Cancel Reason" homeIcon />
        <Text style={[{ paddingVertical: RfH(20) }, commonStyles.headingPrimaryText]}>
          Please provide the reason for class cancellation
        </Text>
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={reasons}
            renderItem={({ item, index }) => renderReasons(item, index)}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              <>
                {reasons.some((item) => item.isCustom && item.selected) && (
                  <TextInput
                    placeholder="Provide a reason"
                    style={{
                      borderRadius: RfH(8),
                      borderColor: Colors.darkGrey,
                      borderWidth: 0.7,
                      marginBottom: RfH(5),
                      padding: 8,
                      height: RfH(80),
                    }}
                    multiline
                    blurOnSubmit
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    onChangeText={(val) => setCancelReason(val)}
                    returnKeyType="done"
                  />
                )}
              </>
            }
          />
        </View>
        <View style={{ marginTop: RfH(32) }}>
          <Button
            onPress={onCancelClass}
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', backgroundColor: Colors.orangeRed }]}>
            <Text style={commonStyles.textButtonPrimary}>Cancel Class</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

export default CancelReason;
