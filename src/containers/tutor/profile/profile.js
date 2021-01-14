import { useMutation, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { appMetaData, notificationsList, tutorDetails, userDetails } from '../../../apollo/cache';
import { APP_VERSION, LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import { alertBox, comingSoonAlert, getFullName, getSaveData, logout, RfH, RfW } from '../../../utils/helpers';
import { Loader, IconButtonWrapper, UserImageComponent } from '../../../components';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { FORGOT_PASSWORD_MUTATION } from '../../common/graphql-mutation';
import styles from './styles';
import NavigationRouteNames from '../../../routes/screenNames';

const ACCOUNT_OPTIONS = [
  { name: 'Personal Details', icon: Images.personal },
  { name: 'Address', icon: Images.home },
  { name: 'Education', icon: Images.education },
  { name: 'Experience', icon: Images.work_office },
  { name: 'Awards & Achievement', icon: Images.award },
  { name: 'Documents', icon: Images.book },
  { name: 'Bank Details', icon: Images.bank },
  { name: 'Business Details', icon: Images.award },
];

const MY_CLASS_OPTIONS = [
  { name: 'Calendar', icon: Images.calendar },
  { name: 'Student PYTN Requests', icon: Images.classes },
];

function Profile(props) {
  const navigation = useNavigation();
  const { changeTab } = props;
  const userInfo = useReactiveVar(userDetails);
  const tutorInfo = useReactiveVar(tutorDetails);
  const appMetaDataObj = useReactiveVar(appMetaData);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const notifyList = useReactiveVar(notificationsList);

  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      //   const error = e.graphQLErrors[0].extensions.exception.response;
      //   console.log(error);
      // }
    },
    onCompleted: (data) => {
      if (data) {
        const { number, countryCode } = userInfo.phoneNumber;
        const mobileObj = {
          mobile: number,
          country: { dialCode: countryCode },
        };
        navigation.navigate(NavigationRouteNames.OTP_CHANGE_PASSWORD, {
          mobileObj,
          fromChangePassword: true,
          newUser: false,
        });
      }
    },
  });

  const logoutConfirmation = () => {
    alertBox('Do you really want to logout?', '', {
      positiveText: 'Yes',
      onPositiveClick: logout,
      negativeText: 'No',
    });
  };

  const getNotificationCount = async () => {
    const notifications = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.NOTIFICATION_LIST));
    if (notifications && notifications.length > 0) {
      const updatedArray = notifications.filter((x) => !x.isRead);
      setNotificationCount(updatedArray.length);
    }
  };

  useEffect(() => {
    getNotificationCount();
  }, [notifyList]);

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
      navigation.navigate(NavigationRouteNames.TUTOR.DOCUMENT_LISTING);
    } else if (item.name === 'Bank Details') {
      navigation.navigate(NavigationRouteNames.BANK_DETAILS);
    } else if (item.name === 'Awards & Achievement') {
      navigation.navigate(NavigationRouteNames.AWARD_LISTING);
    } else if (item.name === 'Customer Care') {
      navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
    } else if (item.name === 'Send Feedback') {
      navigation.navigate(NavigationRouteNames.SEND_FEEDBACK);
    } else if (item.name === 'Calendar') {
      navigation.navigate(NavigationRouteNames.CALENDAR);
    } else if (item.name === 'My Students') {
      comingSoonAlert();
    } else if (item.name === 'Student PYTN Requests') {
      navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_REQUESTS);
    } else {
      return null;
    }
    return null;
  };

  const onChangePasswordClick = () => {
    if (!isEmpty(userInfo.phoneNumber)) {
      const { number, countryCode } = userInfo.phoneNumber;
      forgotPassword({
        variables: { countryCode, number },
      });
    } else {
      alertBox('Please enter mobile number.');
    }
  };

  const renderItem = (item) => (
    <TouchableWithoutFeedback onPress={() => personalDetails(item)}>
      <View
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
          <IconButtonWrapper iconImage={item.icon} iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode="contain" />
          <Text style={[commonStyles.mediumMutedText, { marginLeft: RfW(16) }]}>{item.name}</Text>
        </View>
        <IconButtonWrapper iconImage={Images.chevronRight} iconHeight={RfH(20)} iconWidth={RfW(20)} />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <Loader isLoading={forgotPasswordLoading} />

      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        <View
          style={{
            paddingHorizontal: RfW(16),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.white,
          }}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}>
              {notificationCount > 0 && (
                <View style={{ position: 'absolute', left: 6, top: 6, zIndex: 10 }}>
                  <Image
                    source={Images.small_active_blue}
                    resizeMode="contain"
                    style={{ height: RfH(12), width: RfW(12) }}
                  />
                </View>
              )}
              <Image source={Images.bell} style={{ height: RfH(16), width: RfW(16) }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(20) }}>
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
            <UserImageComponent width={64} height={64} styling={{ borderRadius: RfH(64) }} />

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
          <TouchableWithoutFeedback onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
            <View style={[styles.userMenuParentView, { height: RfH(60) }]}>
              <IconButtonWrapper
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
              <IconButtonWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={isAccountMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </View>
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
            <IconButtonWrapper
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
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.myClass} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Subjects</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Add & Remove Subjects, Class Pricing
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}
        {/* <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_LISTING)}> */}
        {/*  <View style={styles.userMenuParentView}> */}
        {/*    <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.multiple_user} /> */}
        {/*    <View style={styles.menuItemParentView}> */}
        {/*      <Text style={styles.menuItemPrimaryText}>My Students</Text> */}
        {/*      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}> */}
        {/*        Student details */}
        {/*      </Text> */}
        {/*    </View> */}
        {/*  </View> */}
        {/* </TouchableWithoutFeedback> */}

        <View style={commonStyles.blankGreyViewSmall} />

        <TouchableWithoutFeedback onPress={() => setIsBookingMenuOpen(!isBookingMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Classes</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Classes, Students, Student PYTN Requests
              </Text>
            </View>
            <IconButtonWrapper
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
          <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.refFriend} />
          <View style={styles.menuItemParentView}>
            <Text style={styles.menuItemPrimaryText}>Refer A Friend</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
              Send invitation to friend and earn
            </Text>
          </View>
        </TouchableOpacity>

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.personal} />
          <View style={styles.menuItemParentView}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.CUSTOMER_CARE)}>
              <View>
                <Text style={styles.menuItemPrimaryText}>Help</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Customer Care, FAQs, Send feedback
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <TouchableWithoutFeedback onPress={() => setIsAboutGuruMenuOpen(!isAboutGuruMenuOpen)}>
          <View style={styles.userMenuParentView}>
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
            <View style={styles.menuItemParentView}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.ABOUT_US)}>
                <View>
                  <Text style={styles.menuItemPrimaryText}>About GuruQ</Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                    About Us, Team, Know More
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={commonStyles.blankGreyViewSmall} />

        <View style={[styles.userMenuParentView]}>
          <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.settings} />
          <View style={styles.menuItemParentView}>
            <TouchableWithoutFeedback onPress={() => onChangePasswordClick()}>
              <View>
                <Text style={styles.menuItemPrimaryText}>Change Password</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Reset your password
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[styles.userMenuParentView]}>
          <IconButtonWrapper
            iconHeight={RfH(16)}
            iconWidth={RfW(16)}
            imageResizeMode="contain"
            iconImage={Images.logOut}
          />
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
              Version {APP_VERSION}
            </Text>
          </View>

          <View>
            <IconButtonWrapper
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
              Version {appMetaDataObj.currentVersion}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 24, marginBottom: 16 }}>
          <Text style={commonStyles.rhaText}>Powered by RHA Technologies</Text>
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
