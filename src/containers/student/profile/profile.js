import { useMutation, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FORGOT_PASSWORD_MUTATION } from '../../common/graphql-mutation';
import { appMetaData, notificationsList, studentDetails, userDetails } from '../../../apollo/cache';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import { IconButtonWrapper, UserImageComponent, Loader } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { alertBox, APP_VERSION, getFullName, getSaveData, logout, RfH, RfW } from '../../../utils/helpers';
import styles from './styles';

const PERSONAL_OPTIONS = [
  { name: 'Personal Details', icon: Images.personal },
  { name: 'Address', icon: Images.home },
  { name: 'Parents Details', icon: Images.parent_details },
  { name: 'Education', icon: Images.education },
];

const BOOKING_DATA_OPTIONS = [
  { name: 'Purchased History', icon: Images.personal },
  { name: 'My Cart', icon: Images.cart },
];

const MY_CLASSES_OPTIONS = [
  { name: 'Calendar', icon: Images.personal },
  { name: 'Schedule Classes', icon: Images.home },
];

function Profile(props) {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  const [notificationCount, setNotificationCount] = useState(0);
  const studentInfo = useReactiveVar(studentDetails);
  const notifyList = useReactiveVar(notificationsList);
  const appMetaDataObj = useReactiveVar(appMetaData);

  const { changeTab } = props;
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isMyClassesMenuOpen, setIsMyClassesMenuOpen] = useState(false);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);

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
    } else if (item.name === 'Parents Details') {
      navigation.navigate(NavigationRouteNames.STUDENT.PARENTS_LIST);
    } else if (item.name === 'Purchased History') {
      navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_DETAILS);
    } else if (item.name === 'Experience') {
      navigation.navigate(NavigationRouteNames.EXPERIENCE);
    } else if (item.name === 'Customer Care') {
      navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
    } else if (item.name === 'Send Feedback') {
      navigation.navigate(NavigationRouteNames.SEND_FEEDBACK);
    } else if (item.name === 'My Cart') {
      navigation.navigate(NavigationRouteNames.STUDENT.MY_CART);
    } else if (item.name === 'Calendar') {
      changeTab(2);
    } else if (item.name === 'Schedule Classes') {
      changeTab(3);
    } else if (item.name === 'Add Study Area') {
      navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
    } else {
      return null;
    }
    return null;
  };

  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      //   const error = e.graphQLErrors[0].extensions.exception.response;
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

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => personalDetails(item)}
        style={[
          styles.userMenuParentView,
          {
            height: 44,
            justifyContent: 'space-between',
            paddingLeft: RfW(48),
            borderBottomColor: Colors.lightGrey,
          },
        ]}
        activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButtonWrapper iconImage={item.icon} iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode="contain" />
          <Text style={{ fontSize: 15, color: Colors.primaryText, marginLeft: RfW(16) }}>{item.name}</Text>
        </View>
        <IconButtonWrapper iconImage={Images.chevronRight} iconHeight={RfH(20)} iconWidth={RfW(20)} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Loader isLoading={forgotPasswordLoading} />
      <View
        style={{
          height: RfH(24),
          paddingHorizontal: RfW(16),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            <Image source={Images.bell} style={{ height: RfH(16), width: RfW(16) }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
          <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(20) }}>
            <Text style={commonStyles.pageTitleThirdRow}>My Profile</Text>
          </View>
          <View
            style={{
              paddingVertical: RfH(20),
              backgroundColor: Colors.white,
              paddingHorizontal: RfW(16),
              justifyContent: 'center',
            }}>
            <View style={styles.userDetailsView}>
              <UserImageComponent width={64} height={64} styling={{ borderRadius: RfH(64) }} />
              <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: RfW(16), flex: 1 }}>
                <Text style={styles.userName} numberOfLines={2}>
                  {getFullName(userInfo)}
                </Text>
                <Text style={styles.userMobDetails}>
                  +{userInfo?.phoneNumber?.countryCode}-{userInfo?.phoneNumber?.number}
                </Text>
                <Text style={styles.userMobDetails}>S-{studentInfo?.id}</Text>
              </View>
            </View>
          </View>
          <View style={commonStyles.blankGreyViewSmall} />
          <View>
            <TouchableWithoutFeedback
              onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              style={[styles.userMenuParentView, { height: 60 }]}>
              <IconButtonWrapper
                iconHeight={RfH(16)}
                iconWidth={RfW(16)}
                iconImage={Images.profile}
                imageResizeMode="contain"
              />

              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>My Account</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Personal, Addresses, Parents & Education Detail
                </Text>
              </View>
              <IconButtonWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                imageResizeMode="contain"
                iconImage={isAccountMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>
          {isAccountMenuOpen && (
            <SafeAreaView>
              <FlatList
                data={PERSONAL_OPTIONS}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          )}

          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.MY_STUDY_AREAS)}>
            <View style={styles.userMenuParentView}>
              <IconButtonWrapper
                iconHeight={RfH(18)}
                iconWidth={RfW(18)}
                iconImage={Images.book}
                imageResizeMode="contain"
              />
              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>Study Areas</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Manage Study Areas
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <TouchableOpacity
            onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.FAVOURITE_TUTOR)}
            style={styles.userMenuParentView}
            activeOpacity={0.8}>
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.heart} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>Favourites</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Manage your favourite tutors
              </Text>
            </View>
          </TouchableOpacity>

          <View style={commonStyles.blankGreyViewSmall} />

          <TouchableWithoutFeedback onPress={() => setIsMyClassesMenuOpen(!isMyClassesMenuOpen)}>
            <View style={styles.userMenuParentView}>
              <IconButtonWrapper
                iconHeight={RfH(16)}
                iconWidth={RfW(16)}
                iconImage={Images.classes}
                imageResizeMode="contain"
              />
              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>Classes</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Calendar & Upcoming Class, Schedule Class & Renew Class
                </Text>
              </View>
              <IconButtonWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={isMyClassesMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </View>
          </TouchableWithoutFeedback>
          {isMyClassesMenuOpen && (
            <SafeAreaView>
              <FlatList
                data={MY_CLASSES_OPTIONS}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          )}

          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.PYTN_LISTING)}>
            <View style={styles.userMenuParentView}>
              <IconButtonWrapper
                iconHeight={RfH(18)}
                iconWidth={RfW(18)}
                iconImage={Images.book}
                imageResizeMode="contain"
              />
              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>Post Your Tuition Needs</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Manage Your PYTN Requests
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <TouchableWithoutFeedback onPress={() => setIsBookingMenuOpen(!isBookingMenuOpen)}>
            <View style={styles.userMenuParentView}>
              <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>Booking Details</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Purchased History & Cart
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
            <SafeAreaView>
              <FlatList
                data={BOOKING_DATA_OPTIONS}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
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
              <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
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
            <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.settings} />
            <View style={styles.menuItemParentView}>
              <TouchableWithoutFeedback onPress={onChangePasswordClick}>
                <Text style={styles.menuItemPrimaryText}>Change Password</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Reset your password
                </Text>
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
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.versionText, { textAlign: 'center' }]}>
              Powered by RHA Technologies
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

Profile.propTypes = {
  changeTab: PropTypes.func,
};

Profile.defaultProps = {
  changeTab: null,
};
export default Profile;
