import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
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
import { TutorImageComponent } from '../../../components';
import IconWrapper from '../../../components/IconWrapper';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import {
  alertBox,
  clearAllLocalStorage,
  comingSoonAlert,
  getFullName,
  removeToken,
  RfH,
  RfW,
} from '../../../utils/helpers';
import styles from './styles';
import NavigationRouteNames from '../../../routes/screenNames';
import { WEBVIEW_URLS } from '../../../utils/webviewUrls';
import UploadDocument from '../../../components/UploadDocument';

const ACCOUNT_OPTIONS = [
  { name: 'Personal Details', icon: Images.personal },
  { name: 'Address', icon: Images.home },
  { name: 'Education', icon: Images.education },
  { name: 'Experience', icon: Images.work_office },
  { name: 'Awards & Achievement', icon: Images.award },
  // { name: 'Documents', icon: Images.book },
  { name: 'Bank Details', icon: Images.bank },
  { name: 'Business Details', icon: Images.award },
];

const MY_CLASS_OPTIONS = [
  { name: 'Calendar', icon: Images.calendar },
  { name: 'Student Request', icon: Images.classes },
];

const SETTINGS_OPTIONS = [
  { name: 'Change Password', icon: Images.personal },
  { name: 'Update Mobile and Email', icon: Images.home },
  { name: 'Notifications', icon: Images.parent_details },
];

const HELP_OPTIONS = [
  { name: 'Customer Care', icon: Images.personal },
  { name: "FAQ's", icon: Images.home },
  { name: 'Send Feedback', icon: Images.parent_details },
];

const ABOUTUS_OPTIONS = [
  { name: 'About', icon: Images.personal },
  { name: 'Team', icon: Images.home },
];

function Profile(props) {
  const navigation = useNavigation();
  const { changeTab } = props;
  const userInfo = useReactiveVar(userDetails);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const client = initializeApollo();

  const logout = () => {
    removeToken().then(() => {
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

    clearAllLocalStorage(); // .then(() => {
    client.resetStore(); // .then(() => {});
    // });
  };

  const logoutConfirmation = () => {
    alertBox('Do you really want to logout?', '', {
      positiveText: 'Yes',
      onPositiveClick: logout,
      negativeText: 'No',
    });
  };

  const personalDetails = (item) => {
    if (item.name === 'Personal Details') {
      navigation.navigate(NavigationRouteNames.PERSONAL_DETAILS);
    } else if (item.name === 'Address') {
      navigation.navigate(NavigationRouteNames.ADDRESS);
    } else if (item.name === 'Education') {
      navigation.navigate(NavigationRouteNames.EDUCATION);
    } else if (item.name === 'Experience') {
      navigation.navigate(NavigationRouteNames.EXPERIENCE);
    } else if (item.name === 'Business Details') {
      navigation.navigate(NavigationRouteNames.TUTOR.BUSINESS_DETAILS);
    } else if (item.name === 'Documents') {
      // navigation.navigate(NavigationRouteNames.WEB_VIEW, {
      //   url: `http://dashboardv2.guruq.in/tutor/embed/documents`,
      //   label: 'Documents',
      // });
      setIsUploadModalOpen(true);
    } else if (item.name === 'Bank Details') {
      navigation.navigate(NavigationRouteNames.BANK_DETAILS);
    } else if (item.name === 'Awards & Achievement') {
      navigation.navigate(NavigationRouteNames.AWARD_LISTING);
    } else if (item.name === 'Customer Care') {
      navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
    } else if (item.name === "FAQ's") {
      navigation.navigate(NavigationRouteNames.WEB_VIEW, {
        url: WEBVIEW_URLS.FAQ,
        label: "FAQ's",
      });
    } else if (item.name === 'Send Feedback') {
      navigation.navigate(NavigationRouteNames.SEND_FEEDBACK);
    } else if (item.name === 'About') {
      navigation.navigate(NavigationRouteNames.WEB_VIEW, {
        url: WEBVIEW_URLS.ABOUT_US,
        label: 'About',
      });
    } else if (item.name === 'Team') {
      navigation.navigate(NavigationRouteNames.WEB_VIEW, {url: WEBVIEW_URLS.TEAM, label: 'Team'});
    } else if (item.name === 'Calendar') {
      changeTab(2);
    } else if (item.name === 'My Classes') {
      changeTab(3);
    } else if (item.name === 'My Students') {
      comingSoonAlert();
    } else if (item.name === 'Student Request') {
      navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_REQUESTS);
    } else {
      return null;
    }
    return null;
  };
  const renderItem = (item) => (
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
        {/* <View> */}
        {/*  <TouchableOpacity onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}> */}
        {/*    <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} /> */}
        {/*  </TouchableOpacity> */}
        {/* </View> */}
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
            <TutorImageComponent
              tutor={{ profileImage: userInfo.profile, contactDetail: userInfo }}
              width={64}
              height={64}
              styling={{ borderRadius: 64 }}
            />

            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: RfW(16) }}>
              <Text style={styles.userName}>{getFullName(userInfo)}</Text>
              <Text style={styles.userMobDetails}>
                +{userInfo?.phoneNumber?.countryCode}-{userInfo?.phoneNumber?.number}
              </Text>
              <Text style={styles.userMobDetails}>T-{tutorInfo?.id}</Text>
            </View>
          </View>
        </View>
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
                Personal, Address, Education, Experience & Business Details
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
            data={ACCOUNT_OPTIONS}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.VIEW_SCHEDULE)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper
              iconHeight={RfH(16)}
              iconWidth={RfW(16)}
              iconImage={Images.calendar}
              imageResizeMode="contain"
            />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Scheduler</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Modify & Mark Your Availability
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.SUBJECTS_LIST)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.myClass} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Subjects</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Add & Remove Subjects, Class Pricing
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.blankGreyViewSmall} />

        <TouchableWithoutFeedback onPress={() => setIsBookingMenuOpen(!isBookingMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Classes</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Classes, Students, Student Requests
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
          <FlatList
            data={MY_CLASS_OPTIONS}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <View style={commonStyles.blankGreyViewSmall} />

        <TouchableOpacity
          onPress={() => navigation.navigate(NavigationRouteNames.REFER_EARN)}
          style={[styles.userMenuParentView]}
          activeOpacity={0.8}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.refFriend} />
          <View style={styles.menuItemParentView}>
            <Text style={styles.menuItemPrimaryText}>Refer A Friend</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
              Send invitation to friend and earn
            </Text>
          </View>
        </TouchableOpacity>

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.personal} />
          <View style={styles.menuItemParentView}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.CUSTOMER_CARE)}>
              <Text style={styles.menuItemPrimaryText}>Help</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Customer Care, FAQs, Send feedback
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <TouchableWithoutFeedback onPress={() => setIsAboutGuruMenuOpen(!isAboutGuruMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
            <View style={styles.menuItemParentView}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.ABOUT_US)}>
                <Text style={styles.menuItemPrimaryText}>About GuruQ</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  About Us, Team, Know More
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.settings} />
          <View style={styles.menuItemParentView}>
            <TouchableWithoutFeedback onPress={() => alertBox('coming soon!')}>
              <Text style={styles.menuItemPrimaryText}>Change Password</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Reset your password
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[styles.userMenuParentView]}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode="contain" iconImage={Images.logOut} />
          <View style={styles.menuItemParentView}>
            <TouchableOpacity onPress={logoutConfirmation}>
              <Text style={styles.menuItemPrimaryText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={commonStyles.blankGreyViewSmall} />

        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 20,
            marginHorizontal: RfW(20),
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
            <IconWrapper
              iconHeight={RfH(65)}
              iconWidth={RfW(65)}
              iconImage={Images.profile_footer_logo}
              imageResizeMode="contain"
            />
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
