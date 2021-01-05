import { Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';

function Notifications() {
  const [notificationCount, setNotificationCount] = useState(30);
  const [notifications, setNotifications] = useState([{ text: '1' }, { text: '2' }]);

  const renderNotifications = () => {
    return (
      <View
        style={[
          commonStyles.horizontalChildrenSpaceView,
          { marginTop: RfH(8), paddingVertical: RfW(16), alignItems: 'flex-start' },
        ]}>
        <View style={[commonStyles.horizontalChildrenView, { alignItems: 'flex-start' }]}>
          <IconButtonWrapper iconWidth={RfH(48)} iconImage={Images.logo_yellow} iconHeight={RfH(48)} />
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={commonStyles.regularPrimaryText}>English class for Sheena is scheduled </Text>
            <Text style={commonStyles.smallMutedText}>1:45 pm </Text>
          </View>
        </View>
        <View style={{ paddingTop: RfH(8) }}>
          <IconButtonWrapper iconHeight={RfH(4)} iconImage={Images.dots} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScreenHeader
        label="Notification"
        homeIcon
        horizontalPadding={RfW(16)}
        rightIcon={Images.searchIcon}
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
          contentContainerStyle={{ paddingHorizontal: RfW(16), paddingBottom: RfH(32) }}
        />
      </View>
    </View>
  );
}

export default Notifications;
