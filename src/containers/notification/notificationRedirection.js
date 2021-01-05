import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { notificationPayload, offeringsMasterData } from '../../apollo/cache';
import NavigationRouteNames from '../../routes/screenNames';

const SCREEN_NAME = {
  TUTOR_DETAIL: 'tutor_detail',
};

function NotificationRedirection() {
  const notificationPayloadObj = useReactiveVar(notificationPayload);
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const navigation = useNavigation();


  const tutorRedirection = () => {
    console.log("notificationPayloadObj",notificationPayloadObj,offeringMasterData)
    if (notificationPayloadObj.tutor_id && notificationPayloadObj.offering_id) {
      notificationPayload({});
      const selectedOffering = offeringMasterData.find(
        (s) => s?.id === notificationPayloadObj?.offering_id
      );
      if (selectedOffering) {
        navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
          tutorId: notificationPayloadObj.tutor_id,
          parentOffering: selectedOffering?.id,
          parentParentOffering: selectedOffering?.parentOffering?.id,
          parentOfferingName: selectedOffering?.displayName,
          parentParentOfferingName: selectedOffering?.parentOffering?.displayName,
        });
      }
    }

  };
  useEffect(() => {
    if (!isEmpty(notificationPayloadObj) && notificationPayloadObj.screen && !isEmpty(offeringMasterData)) {
      console.log("notificationPayloadObj.screen",notificationPayloadObj)
      switch (notificationPayloadObj.screen) {
        case SCREEN_NAME.TUTOR_DETAIL: {
          tutorRedirection();
          break;
        }
      }
    }
  }, [notificationPayloadObj,offeringMasterData]);

  return <></>;
}
export default NotificationRedirection;
