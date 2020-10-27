import { Image, Text, View, StatusBar, FlatList } from 'react-native';
import React, { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import IconWrapper from '../../../../components/IconWrapper';
import styles from '../styles';

function profile() {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [accountData, setAccountData] = useState([
    { name: 'Personal Details', icon: Images.personal },
    { name: 'Address', icon: Images.home },
    { name: 'Parents Details', icon: Images.parent_details },
    { name: 'Education', icon: Images.education },
  ]);

  const renderItem = (item) => {
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch', paddingLeft: RfW(16) }}>
      <IconWrapper iconImage={Images.personal} />
      <Text style={{ color: Colors.darktitle }}>{item.name}</Text>
    </View>;
  };

  return (
    <View style={commonStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.myProfileText}>My Profile</Text>
      <View style={styles.userDetailsView}>
        <Image style={styles.userIcon} source={Images.user} />
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <Text
            style={{ marginTop: RfH(8), marginLeft: RfW(12), fontSize: 18, fontWeight: '600', color: 'rgb(25,24,24)' }}>
            Sheena Jain
          </Text>
          <Text style={{ marginLeft: RfW(12), marginTop: RfH(2), color: 'rgb(129,129,129)' }}>+91-9876543210</Text>
          <Text style={{ marginLeft: RfW(12), color: 'rgb(129,129,129)' }}>GURUQS21223I</Text>
        </View>
      </View>
      <View style={{ flex: 1, borderBottomColor: Colors.inputLabel, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: RfH(16) }}>
        <View style={{ flex: 0.25, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.heart} />
          <Text style={{ fontSize: 12, color: Colors.inputLabel, marginTop: RfH(8) }}>Favourites</Text>
        </View>
        <View style={{ flex: 0.25, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.bell} />
          <Text style={{ fontSize: 12, color: Colors.inputLabel, marginTop: RfH(8) }}>Notification</Text>
        </View>
        <View style={{ flex: 0.25, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.qpoint} />
          <Text style={{ fontSize: 12, color: Colors.inputLabel, marginTop: RfH(8) }}>Q Points</Text>
        </View>
        <View style={{ flex: 0.25, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.cart} />
          <Text style={{ fontSize: 12, color: Colors.inputLabel, marginTop: RfH(8) }}>Cart</Text>
        </View>
      </View>
      <View style={{ flex: 1, borderBottomColor: Colors.inputLabel, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
      <View
        style={{
          flex: 1,
          marginTop: RfH(16),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.profile} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.darktitle, marginLeft: RfW(12) }}>
            My Account
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: RfW(12), color: Colors.inputLabel }}>
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
      <View style={{ flex: 1, borderBottomColor: Colors.inputLabel, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
      <View>
        {isAccountMenuOpen && (
          <FlatList
            data={accountData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
}

export default profile;
