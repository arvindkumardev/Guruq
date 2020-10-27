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
  const [isStudyMenuOpen, setIsStudyMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isMyClassesMenuOpen, setIsMyClassesMenuOpen] = useState(false);
  const [isReferFriendMenuOpen, setIsReferFriendMenuOpen] = useState(false);
  const [isInformationMenuOpen, setIsInformationMenuOpen] = useState(false);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);



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
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.profile} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}>My Study Area</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Add/Modify study area
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsStudyMenuOpen(!isStudyMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isStudyMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}>Booking Details</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Purchased History
         </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsBookingMenuOpen(!isBookingMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isBookingMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.myClass} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}> My Classes</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Calendar, Schedule Class, Renew Class, Class...
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsMyClassesMenuOpen(!isMyClassesMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isMyClassesMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.refFriend} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}>Refer A Friend</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Send invitation to friend and earn
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsReferFriendMenuOpen(!isReferFriendMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isReferFriendMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.moreInformation} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}> More Information</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Customer Care, FAQ's, Send feedback
         </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsInformationMenuOpen(!isInformationMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isInformationMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}> About GuruQ</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            About, team
         </Text>
        </View>
        <TouchableWithoutFeedback onPress={() => setIsAboutGuruMenuOpen(!isAboutGuruMenuOpen)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isAboutGuruMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separatorView} />

      <View style={styles.userMenuParentView}>
        <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.logOut} />
        <View style={styles.menuItemParentView}>
          <Text style={styles.menuItemPrimaryText}> Logout</Text>
          {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Calendar, Schedule Class, Renew Class, Class...
         </Text> */}
        </View>
        {/* <TouchableWithoutFeedback onPress={() => setIsLogout(!isLogout)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            styling={{ flex: 0.2 }}
            iconImage={isLogout ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback> */}
      </View>
      <View style={styles.separatorView} />
      <View style={{
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 100,
        marginTop: -20
      }}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Current
         </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Version.2.5
           </Text>
        </View>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <IconWrapper styling={{ flex: 0.1 }} iconHeight={RfH(65)} iconWidth={RfW(65)} iconImage={Images.profile_footer_logo} />

          <View style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
              Powered by
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
              RHA Technologies
              </Text>
          </View>
          <View>
          </View>
        </View>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Latest
           </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Version.3.0
          </Text>
        </View>
      </View>
    </View>
  );
}

export default profile;
