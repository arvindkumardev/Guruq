import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import initializeApollo from '../../../apollo/apollo';
import { isLoggedIn, studentDetails, tutorDetails, userDetails, userType } from '../../../apollo/cache';
import { IconButtonWrapper } from '../../../components';
import IconWrapper from '../../../components/IconWrapper';
import { default as NavigationRouteNames, default as routeNames } from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { clearAllLocalStorage, getUserImageUrl, removeToken, RfH, RfW } from '../../../utils/helpers';
import styles from './styles';

function Profile() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  const studentInfo = useReactiveVar(studentDetails);

  // console.log('navigation===>',props)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isPersonalMenuOpen, setIsPersonalMenuOpen] = useState(true);

  const [accountData, setAccountData] = useState([
    { name: 'Personal Details', icon: Images.personal },
    { name: 'Address', icon: Images.home },
    { name: 'Parents Details', icon: Images.parent_details },
    { name: 'Education', icon: Images.education },
  ]);
  const [myStudyData, setMyStudyData] = useState([
    { name: 'Add Study Area', icon: Images.personal },
    { name: 'Modify Study Area', icon: Images.home },
  ]);
  const [bookingData, setBookingData] = useState([
    { name: 'Purchased History', icon: Images.personal },
    { name: 'My Cart', icon: Images.cart },
  ]);
  const [myClassesData, setMyClassesData] = useState([
    { name: 'Calendar', icon: Images.personal },
    { name: 'Upcoming Classes', icon: Images.home },
  ]);
  const [isStudyMenuOpen, setIsStudyMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false);
  const [isMyClassesMenuOpen, setIsMyClassesMenuOpen] = useState(false);
  const [isReferFriendMenuOpen, setIsReferFriendMenuOpen] = useState(false);
  const [isInformationMenuOpen, setIsInformationMenuOpen] = useState(false);
  const [settingsData, setSettingsData] = useState([
    { name: 'Change Password', icon: Images.personal },
    { name: "Change Mobile and email", icon: Images.home },
    { name: 'Notifications', icon: Images.parent_details },
  ]);
  const [informationData, setInformationData] = useState([
    { name: 'Customer Care', icon: Images.personal },
    { name: "FAQ's", icon: Images.home },
    { name: 'Send Feedback', icon: Images.parent_details },
  ]);
  const [isAboutGuruMenuOpen, setIsAboutGuruMenuOpen] = useState(false);

  const client = initializeApollo();

  const logout = () => {
    clearAllLocalStorage().then(() => {
      client.cache.reset().then(() => {
        removeToken().then(() => {
          // set in apollo cache
          isLoggedIn(false);
          userType('');
          userDetails({});

          studentDetails({});
          tutorDetails({});
        });
      });
    });
  };
  const personalDetails = (item) => {
    if (item.name === 'Personal Details') {
      navigation.navigate(routeNames.STUDENT.WEB_VIEW_PAGES);
      // setIsPersonalMenuOpen(false)
      //  alert('ok')
    } else {
      // setIsPersonalMenuOpen(true)
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
            height: 44,
            justifyContent: 'space-between',
            paddingLeft: RfW(48),
            borderBottomColor: Colors.lightGrey,
          },
        ]}>
        <View style={{ flexDirection: 'row' }}>
          <IconWrapper iconImage={item.icon} iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode="contain" />
          <Text style={{ fontSize: 15, color: Colors.primaryText, marginLeft: RfW(16) }}>{item.name}</Text>
        </View>
        <IconWrapper iconImage={Images.chevronRight} iconHeight={RfH(20)} iconWidth={RfW(20)} />
      </TouchableWithoutFeedback>
    );
  };

  const renderActionIcons = () => {
    return (
      <View style={[styles.userMenuParentView, { justifyContent: 'space-evenly', alignItems: 'center' }]}>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.heart} />
          <Text style={styles.actionText}>Favourites</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bell} />
          <Text style={styles.actionText}>Notification</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.qpoint} />
          <Text style={styles.actionText}>Q Points</Text>
        </View>
        <View style={styles.actionIconParentView}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.MY_CART)}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.cart} />
            <Text style={styles.actionText}>Cart</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          height: 44,
          paddingHorizontal: RfW(16),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}>
            <Image source={Images.cart} style={{ height: RfH(16), width: RfW(16) }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: RfW(16) }}
            onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}>
            <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
        <ScrollView
          // stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          // onScroll={(event) => handleScroll(event)}
          scrollEventThrottle={16}>
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
                <Text style={styles.userMobDetails}>S{userInfo?.id}</Text>
              </View>
            </View>
          </View>
          {/* <View style={commonStyles.lineSeparator} /> */}
          {/* {renderActionIcons()} */}

          <View style={commonStyles.blankGreyViewSmall} />
          <View>
            <TouchableWithoutFeedback
              onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              style={[styles.userMenuParentView, , { height: 60 }]}>
              <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.profile} />

              <View style={styles.menuItemParentView}>
                <Text style={styles.menuItemPrimaryText}>My Account</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Personal Details, Address, Parent Details, Education
                </Text>
              </View>
              <IconWrapper
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
                data={accountData}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          )}

          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.book} />
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
                imageResizeMode="cover"
                iconImage={isStudyMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>
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

          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.bookingDetails} />
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
                iconImage={isBookingMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>
          {isBookingMenuOpen && (
            <SafeAreaView>
              <FlatList
                data={bookingData}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          )}

          <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.classes} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Classes</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Calendar, Schedule Class, Renew Class, Class...
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => setIsMyClassesMenuOpen(!isMyClassesMenuOpen)}>
              <IconWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={isMyClassesMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>
          {isMyClassesMenuOpen && (
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

          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.heart} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>My Favourites</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Add and remove your favourite tutors
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => setIsMyClassesMenuOpen(!isMyClassesMenuOpen)}>
              <IconWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={isMyClassesMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={commonStyles.blankGreyViewSmall} />

          <View style={[styles.userMenuParentView]}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.refFriend} />
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
                iconImage={isReferFriendMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={commonStyles.blankGreyViewSmall} />

          <View style={[styles.userMenuParentView]}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.settings} />
            <View style={styles.menuItemParentView}>
              <TouchableWithoutFeedback onPress={() => setIsInformationMenuOpen(!isInformationMenuOpen)}>
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

          <View style={commonStyles.blankGreyViewSmall} />

          <View style={[styles.userMenuParentView]}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.moreInformation} />
            <View style={styles.menuItemParentView}>
              <TouchableWithoutFeedback onPress={() => setIsInformationMenuOpen(!isInformationMenuOpen)}>
                <Text style={styles.menuItemPrimaryText}>Help</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                  Customer Care, FAQ's, Send feedback
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

          <View style={styles.userMenuParentView}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.aboutGuru} />
            <View style={styles.menuItemParentView}>
              <Text style={styles.menuItemPrimaryText}>About GuruQ</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                About, team
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => setIsAboutGuruMenuOpen(!isAboutGuruMenuOpen)}>
              <IconWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={isAboutGuruMenuOpen ? Images.collapse_grey : Images.expand_gray}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={commonStyles.blankGreyViewSmall} />

          <View style={[styles.userMenuParentView]}>
            <IconWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} imageResizeMode={'contain'} iconImage={Images.logOut} />
            <View style={styles.menuItemParentView}>
              <TouchableOpacity onPress={logout}>
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
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
              marginHorizontal:RfW(20)
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
    </>
  );
}

export default Profile;
