import { Text, Image, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation, useReactiveVar } from '@apollo/client';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Colors, Images } from '../../../theme';
import { notificationsList } from '../../../apollo/cache';
import { RfH, RfW, getSaveData, storeData, removeData } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';

function Notifications() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const notifyList = useReactiveVar(notificationsList);
  useEffect(() => {
    getNotificationList();
  }, []);
  useEffect(() => {
    getNotificationList();
  }, [notifyList]);
  const getNotificationList = async () => {
    let notifications = [];
    notifications = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.NOTIFICATION_LIST));
    if (notifications && notifications.length > 0) {
      const uniqueListByID = _.uniqBy(notifications, 'messageId');
      setNotifications(uniqueListByID);
      setNotificationCount(uniqueListByID.filter((x) => !x.isRead).length);
    }
  };
  const updateReadNotification = (item, index) => {
    const selectIndex = notifications.findIndex((x, inx) => x.messageId == item.messageId);

    if (selectIndex > -1) {
      const array = [...notifications];
      array[selectIndex].isRead = true;
      const newArray = array;
      storeData(LOCAL_STORAGE_DATA_KEY.NOTIFICATION_LIST, JSON.stringify(newArray)).then(() => {
        console.log('Update data succesfully', newArray);
      });
      const uniqueListByID = _.uniqBy(notifications, 'messageId');
      setNotifications(uniqueListByID);
      setNotifications(uniqueListByID);
      setNotificationCount(uniqueListByID.filter((x) => !x.isRead).length);
      // notificationsList(notifyList)
    }
  };
  const renderNotifications = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => updateReadNotification(item, index)}
        style={[
          commonStyles.horizontalChildrenSpaceView,
          {
            // marginTop: RfH(8),
            // paddingVertical: RfW(16),
            alignItems: 'flex-start',
          },
        ]}>
        <View style={[commonStyles.horizontalChildrenView, { alignItems: 'flex-start' }]}>
          {/* <IconButtonWrapper
            iconWidth={RfH(48)}
            imageResizeMode={'contain'}
            iconImage={Images.logo_yellow}
            iconHeight={RfH(42)}
          /> */}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text style={commonStyles.regularPrimaryText}>
              {item.message ? item.message : 'No Message sajdsagdgasdjas'}
            </Text>
            <Text style={[commonStyles.smallMutedText]}>
              {item.sentTime ? moment(item.sentTime).format('lll') : ''}
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: RfH(8), paddingHorizontal: 8 }}>
          {item && !item.isRead && (
            <View style={{ position: 'absolute', top: -2, zIndex: 10 }}>
              <Image
                source={Images.small_active_blue}
                resizeMode="contain"
                style={{ height: RfH(16), width: RfW(16) }}
              />
            </View>
          )}
          {/* <IconButtonWrapper iconHeight={RfH(4)} iconImage={Images.dots} /> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScreenHeader
        label="Notification"
        homeIcon
        horizontalPadding={RfW(16)}
        rightIcon={Images.searchIcon}
        onRightIconClick={() => null}
        showRightIcon
      />
      <Text style={[commonStyles.smallMutedText, { marginHorizontal: RfW(16), marginVertical: RfH(8) }]}>
        {notificationCount} Notifications
      </Text>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={notifications}
          renderItem={({ item, index }) => renderNotifications(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: RfW(16),
            paddingBottom: RfH(32),
          }}
        />
      </View>
    </View>
  );
}

export default Notifications;
