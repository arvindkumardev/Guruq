import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import initializeApollo from '../../../apollo/apollo';
import {
  interestingOfferingData,
  isLoggedIn,
  isSplashScreenVisible,
  isTokenLoading,
  networkConnectivityError,
  notificationPayload,
  offeringsMasterData,
  studentDetails,
  tutorDetails,
  userDetails,
  userLocation,
  userType,
} from '../../../apollo/cache';
import { IconButtonWrapper } from '../../../components';
import IconWrapper from '../../../components/IconWrapper';
import { default as NavigationRouteNames, default as routeNames } from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { clearAllLocalStorage, getUserImageUrl, removeToken, RfH, RfW } from '../../../utils/helpers';
import styles from './styles';

function Profile(props) {
  const navigation = useNavigation();
  const { changeTab } = props;
  const userInfo = useReactiveVar(userDetails);
  const tutorInfo = useReactiveVar(tutorDetails);

  // console.log('navigation===>',props)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isPersonalMenuOpen, setIsPersonalMenuOpen] = useState(true);

  const [accountData, setAccountData] = useState([
    { name: 'Personal Details', icon: Images.personal },
    { name: 'Address', icon: Images.home },
    { name: 'Education', icon: Images.education },
    { name: 'Experience', icon: Images.education },
    { name: 'Documents', icon: Images.book },
    { name: 'Bank Details', icon: Images.bank },
  ]);
  const [myStudyData, setMyStudyData] = useState([
    { name: 'View Schedule', icon: Images.calendar },
    { name: 'Update Schedule', icon: Images.calendar },
  ]);
  const [bookingData, setBookingData] = useState([{ name: 'Purchased History', icon: Images.personal }]);
  const [myClassesData, setMyClassesData] = useState([
    { name: 'My Classes', icon: Images.laptop },
    { name: 'My Students', icon: Images.home },
  ]);
  const [isStudyMenuOpen, setIsStudyMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isMyClassesMenuOpen, setIsMyClassesMenuOpen] = useState(false);
  const [isReferFriendMenuOpen, setIsReferFriendMenuOpen] = useState(false);
  const [isInformationMenuOpen, setIsInformationMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const [settingsData, setSettingsData] = useState([
    { name: 'Change Password', icon: Images.personal },
    { name: 'Update Mobile and Email', icon: Images.home },
    { name: 'Notifications', icon: Images.parent_details },
  ]);
  const [informationData, setInformationData] = useState([
    { name: 'Customer Care', icon: Images.personal },
    { name: "FAQ's", icon: Images.home },
    { name: 'Send Feedback', icon: Images.parent_details },
  ]);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);
  const [about, setAbout] = useState([
    { name: 'About', icon: Images.personal },
    { name: 'Team', icon: Images.home },
  ]);

  const client = initializeApollo();

  const logout = () => {
    clearAllLocalStorage().then(() => {
      client.resetStore().then(() => {
        removeToken().then(() => {
          // // set in apollo cache
          isTokenLoading(true);
          isLoggedIn(false);
          isSplashScreenVisible(true);
          userType('');
          networkConnectivityError(false);
          userDetails({});
          studentDetails({});
          tutorDetails({});
          userLocation({});
          offeringsMasterData([]);
          interestingOfferingData([]);
          notificationPayload({});
        });
      });
    });
  };

  const personalDetails = (item) => {
    if (item.name === 'Personal Details') {
      navigation.navigate(routeNames.PERSONAL_DETAILS);
    } else if (item.name === 'Address') {
      navigation.navigate(routeNames.ADDRESS);
    } else if (item.name === 'Education') {
      navigation.navigate(routeNames.EDUCATION);
    } else if (item.name === 'Experience') {
      navigation.navigate(routeNames.EXPERIENCE);
    } else if (item.name === 'Documents') {
      navigation.navigate(routeNames.WEB_VIEW, {
        url: `http://dashboardv2.guruq.in/tutor/embed/documents`,
        label: 'Documents',
      });
    } else if (item.name === 'Bank Details') {
      navigation.navigate(routeNames.BANK_DETAILS);
    } else if (item.name === 'Customer Care') {
      navigation.navigate(routeNames.CUSTOMER_CARE);
    } else if (item.name === "FAQ's") {
      navigation.navigate(routeNames.WEB_VIEW, {
        url: `http://dashboardv2.guruq.in/tutor/embed/bankDetails`,
        label: "FAQ's",
      });
    } else if (item.name === 'Send Feedback') {
      navigation.navigate(routeNames.SEND_FEEDBACK);
    } else if (item.name === 'About') {
      navigation.navigate(routeNames.WEB_VIEW, {
        url: `http://dashboardv2.guruq.in/tutor/embed/experience`,
        label: 'About',
      });
    } else if (item.name === 'Team') {
      navigation.navigate(routeNames.WEB_VIEW, {
        url: `http://dashboardv2.guruq.in/tutor/embed/experience`,
        label: 'Team',
      });
    } else if (item.name === 'My Classes' || item.name === 'My Students') {
      changeTab(3);
    } else if (item.name === 'View Schedule') {
      navigation.navigate(routeNames.TUTOR.VIEW_SCHEDULE);
    } else if (item.name === 'Update Schedule') {
      navigation.navigate(routeNames.TUTOR.UPDATE_SCHEDULE);
    } else {
      return null;
    }
    return null;
  };
  const renderItem = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => personalDetails(item)}
        style={[
          styles.userMenuParentView,
          {
            height: RfH(44),
            justifyContent: 'space-between',
            paddingLeft: RfW(48),
            borderBottomColor: Colors.lightGrey,
          },
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconWrapper iconImage={item.icon} iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode="contain" />
          <Text style={[commonStyles.mediumMutedText, { marginLeft: RfW(16) }]}>{item.name}</Text>
        </View>
        <IconWrapper iconImage={Images.chevronRight} iconHeight={RfH(20)} iconWidth={RfW(20)} />
      </TouchableWithoutFeedback>
    );
  };

  // const renderActionIcons = () => {
  //   return (
  //     <View style={[styles.userMenuParentView, { justifyContent: 'space-evenly', alignItems: 'center' }]}>
  //       <View
  //         style={[styles.actionIconParentView, { flex: 0.5, borderRightColor: Colors.darkGrey, borderRightWidth: 1 }]}>
  //         <IconWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.bell} />
  //         <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Notification</Text>
  //       </View>
  //       <View style={[styles.actionIconParentView, { flex: 0.5 }]}>
  //         <IconWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.qpoint} />
  //         <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Q Points</Text>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          height: 44,
          paddingHorizontal: RfW(16),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row' }} />
        <View>
          <TouchableOpacity onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}>
            <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        <View style={{ paddingHorizontal: RfW(16), height: 54 }}>
          <Text style={commonStyles.pageTitleThirdRow}>My Profile</Text>
        </View>
        <View
          style={{
            height: 102,
            backgroundColor: Colors.white,
            paddingHorizontal: RfW(16),
            justifyContent: 'center',
          }}>
          <View style={styles.userDetailsView}>
            {/* <Image style={styles.userIcon} source={Images.user} /> */}
            <IconButtonWrapper
              style={styles.userIcon}
              iconHeight={RfH(64)}
              iconWidth={RfH(64)}
              iconImage={getUserImageUrl(userInfo?.profileImage?.filename, userInfo?.gender, userInfo?.id)}
              styling={{ borderRadius: RfH(64) }}
            />
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: RfW(16) }}>
              <Text style={styles.userName}>
                {userInfo?.firstName} {userInfo?.lastName}
              </Text>
              <Text style={styles.userMobDetails}>
                +{userInfo?.phoneNumber?.countryCode}-{userInfo?.phoneNumber?.number}
              </Text>
              <Text style={styles.userMobDetails}>T{userInfo?.id}</Text>
            </View>
          </View>
        </View>
        {/* <View style={commonStyles.lineSeparator} /> */}
        {/* <View style={{ paddingVertical: RfH(16) }}>{renderActionIcons()}</View> */}
        <View style={commonStyles.blankGreyViewSmall} />
        <View>
          <TouchableWithoutFeedback
            onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            style={[styles.userMenuParentView, { height: RfH(60) }]}>
            <IconWrapper
              iconHeight={RfH(16)}
              iconWidth={RfW(16)}
              iconImage={Images.profile}
              imageResizeMode="contain"
            />

            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Account</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Personal Details, Address, Parent Details, Education
              </Text>
            </View>
            <IconWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={isAccountMenuOpen ? Images.collapse_grey : Images.expand_gray}
            />
          </TouchableWithoutFeedback>
        </View>
        {isAccountMenuOpen && (
          <FlatList
            data={accountData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        <TouchableWithoutFeedback onPress={() => setIsStudyMenuOpen(!isStudyMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper
              iconHeight={RfH(16)}
              iconWidth={RfW(16)}
              iconImage={Images.profile}
              imageResizeMode="contain"
            />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Scheduler</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Mark your Availability - date and time slots
              </Text>
            </View>
            <IconWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={isStudyMenuOpen ? Images.collapse_grey : Images.expand_gray}
            />
          </View>
        </TouchableWithoutFeedback>
        {isStudyMenuOpen && (
          <SafeAreaView>
            <FlatList
              data={myStudyData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        )}
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        <TouchableWithoutFeedback onPress={() => setIsBookingMenuOpen(!isBookingMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Classes</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Classes, Students, Tuition Requests
              </Text>
            </View>
            <IconWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={isBookingMenuOpen ? Images.collapse_grey : Images.expand_gray}
            />
          </View>
        </TouchableWithoutFeedback>
        {isBookingMenuOpen && (
          <SafeAreaView>
            <FlatList
              data={myClassesData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        )}
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.TUTOR.SUBJECTS_LIST)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.myClass} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Subjects</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Add price for the classes, Subject profile
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.blankGreyViewSmall} />

        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.REFER_EARN)}>
          <View style={[styles.userMenuParentView]}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.refFriend} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Refer A Friend</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Send invitation to friend and earn
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.settings} />
          <View style={styles.menuItemParentView}>
            <TouchableWithoutFeedback onPress={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}>
              <Text style={styles.menuItemPrimaryText}>Settings</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Account Settings, Change Password, Notifications
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={isInformationMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        {isSettingsMenuOpen && (
          <SafeAreaView>
            <FlatList
              data={settingsData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        )}

        <View style={commonStyles.blankGreyViewSmall} />

        <TouchableOpacity
          style={[styles.userMenuParentView]}
          onPress={() => setIsInformationMenuOpen(!isInformationMenuOpen)}
          activeOpacity={1}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.moreInformation} />
          <View style={styles.menuItemParentView}>
            <View>
              <Text style={styles.menuItemPrimaryText}>Help</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Customer Care, FAQ's, Send feedback
              </Text>
            </View>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={isInformationMenuOpen ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableOpacity>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        {isInformationMenuOpen && (
          <SafeAreaView>
            <FlatList
              data={informationData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        )}
        <TouchableWithoutFeedback onPress={() => setIsAboutGuruMenuOpen(!isAboutGuruMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>About GuruQ</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                About, team
              </Text>
            </View>
            <IconWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              iconImage={isAboutGuruMenuOpen ? Images.collapse_grey : Images.expand_gray}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        {isAboutGuruMenuOpen && (
          <SafeAreaView>
            <FlatList
              data={about}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        )}

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.logOut} />
          <View style={styles.menuItemParentView}>
            <TouchableOpacity onPress={() => logout()}>
              <Text style={styles.menuItemPrimaryText}>Logout</Text>
            </TouchableOpacity>

            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
            Calendar, Schedule Class, Renew Class, Class...
         </Text> */}
          </View>

          {/* <TouchableWithoutFeedback onPress={() => setIsLogout(!isLogout)}>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}

            iconImage={isLogout ? Images.collapse_grey : Images.expand_gray}
          />
        </TouchableWithoutFeedback> */}
        </View>
        {/* <View style={commonStyles.lineSeparator} /> */}
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.versionText}>
              Current
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.versionText}>
              Version 2.5
            </Text>
          </View>

          <View>
            <IconButtonWrapper iconWidth={RfW(65)} iconImage={Images.profile_footer_logo} imageResizeMode="contain" />
          </View>

          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.versionText}>
              Latest
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.versionText}>
              Version 3.0
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 24, marginBottom: 16 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.versionText, { textAlign: 'center' }]}>
            Powered by RHA Technologies
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
Profile.propTypes = {
  changeTab: PropTypes.func,
};

Profile.defaultProps = {
  changeTab: null,
};

export default Profile;
