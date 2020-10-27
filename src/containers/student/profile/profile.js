import { Image, Text, View, StatusBar, FlatList, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import IconWrapper from '../../../components/IconWrapper';
import styles from '../dashboard/styles';

function profile() {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [accountData, setAccountData] = useState([
    { name: 'Personal Details', icon: Images.personal },
    { name: 'Address', icon: Images.home },
    { name: 'Parents Details', icon: Images.parent_details },
    { name: 'Education', icon: Images.education },
  ]);

  const renderItem = (item) => {
    return (
      <View
        style={[
          styles.userMenuParentView,
          { justifyContent: 'space-between', paddingLeft: RfW(16), marginTop: RfH(20) },
        ]}>
        <View style={{ flexDirection: 'row' }}>
          <IconWrapper iconImage={item.icon} iconHeight={RfH(18)} iconWidth={RfW(20)} />
          <Text style={{ color: Colors.darktitle, marginLeft: RfW(8) }}>{item.name}</Text>
        </View>
        <IconWrapper iconImage={Images.chevronRight} iconHeight={RfH(20)} iconWidth={RfW(20)} />
      </View>
    );
  };

  const renderActionIcons = () => {
    return (
      <View style={[styles.userMenuParentView, { justifyContent: 'space-evenly' }]}>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.heart} />
          <Text style={styles.actionText}>Favourites</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.bell} />
          <Text style={styles.actionText}>Notification</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.qpoint} />
          <Text style={styles.actionText}>Q Points</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.cart} />
          <Text style={styles.actionText}>Cart</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.myProfileText}>My Profile</Text>
      <View style={styles.userDetailsView}>
        <Image style={styles.userIcon} source={Images.user} />
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <Text style={styles.userName}>Sheena Jain</Text>
          <Text style={styles.userMobDetails}>+91-9876543210</Text>
          <Text style={styles.userMobDetails}>GURUQS21223I</Text>
        </View>
      </View>
      <View style={styles.separatorView} />
      {renderActionIcons()}
      <View style={styles.separatorView} />
      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.profile} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}>My Account</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Personal Details , Address , Parent Details , Education
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isAccountMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />
      {isAccountMenuOpen && (
        <SafeAreaView>
          <FlatList
            data={accountData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

export default profile;
