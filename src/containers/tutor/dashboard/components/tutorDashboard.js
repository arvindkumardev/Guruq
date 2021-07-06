/* eslint-disable import/no-duplicates */
/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { tutorDetails, userDetails, userToken } from '../../../../apollo/cache';
import { IconButtonWrapper, UpcomingClassComponent } from '../../../../components';
import Loader from '../../../../components/Loader';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import { getBoxColor } from '../../../../theme/colors';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import {
  STANDARD_SCREEN_SIZE,
  GURUQ_WHATSAPP_NUMBER_VACCINATION,
} from '../../../../utils/constants';
import { alertBox, deviceWidth, getSubjectIcons, printDate, RfH, RfW } from '../../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../../../student/booking.query';
import { GET_TUTOR_OFFERINGS } from '../../../student/tutor-query';
import { GET_APP_CAROUSELS } from '../../../app.query';
import TutorSubjectsModal from './tutorSubjectsModal';
import CustomImage from '../../../../components/CustomImage';
import UserImageComponent from '../../../../components/UserImageComponent';
import NotificationRedirection from '../../../notification/notificationRedirection';
import { BannerTypeEnum } from '../../../../common/banner.enum';
import { getDocumentFileUrl } from '../../../../utils/helpers';

// const carouselItems = [
//   {
//     image: Images.tutor_home_banner_1,
//     routeName: NavigationRouteNames.PERSONAL_DETAILS,
//   },
//   {
//     image: Images.tutor_home_banner_2,
//     routeName: NavigationRouteNames.TUTOR.VIEW_SCHEDULE,
//   },
//   { image: Images.tutor_home_banner_3, routeName: NavigationRouteNames.TUTOR.SUBJECTS_LIST },
// ];

function TutorDashboard(props) {
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const userTokenVal = useReactiveVar(userToken);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [refreshSubjectList, setRefreshSubjectList] = useState(false);
  const tutorInfo = useReactiveVar(tutorDetails);
  const userInfo = useReactiveVar(userDetails);
  const [carouselItems, setCarouselItems] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  

  useEffect(()=>{

    if(tutorInfo)
    {
      if (!(tutorInfo?.additionalProperties?.covidVaccinated)) {
           alertBox(
             'Alert',
             'You need to get covid vaccinated for taking the offline class. Connect us on WhatsApp no  919891587300  to know more',
             {
               positiveText: 'Yes',
               onPositiveClick: () => {
                openWhatsappPopup()
               },
               negativeText: 'No',
             },
           );
      }
    }
  },[])

  function openWhatsappPopup()
  {
      const url = `whatsapp://send?text=Hi&phone=91${GURUQ_WHATSAPP_NUMBER_VACCINATION}`;
      Linking.openURL(url)
        .then((data) => {
          console.log(`WhatsApp Opened successfully ${data}`); // <---Success
        })
        .catch(() => {
          alertBox('Make sure WhatsApp installed on your device'); // <---Error
        });
  }

  useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        alertBox('Alert', 'Do you really want to exit?', {
          positiveText: 'Yes',
          onPositiveClick: () => {
            BackHandler.exitApp();
          },
          negativeText: 'No',
        });
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [isFocused]);


  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setUpcomingClasses(data.getScheduledClasses.filter((c) => moment(c.endDate).isAfter(moment())));
    },
  });

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo?.id },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        const subjectList = [];
        data?.getTutorOfferings?.map((item) => {
          if (item.offering && subjectList.findIndex((obj) => obj.offering.id === item.offering.id) === -1) {
            subjectList.push(item);
          }
        });
        setSubjects(subjectList);
        setRefreshSubjectList(!refreshSubjectList);
      }
    },
  });


  
  const [getAppCarousels, { loading: loadingAppCarousels }] =
    useLazyQuery(GET_APP_CAROUSELS, {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        console.log(e);
      },
      onCompleted: (data) => {
        console.log("AppCarousels: Value of data is ",data)
          setCarouselItems(data.getAppCarousels);
      },
    });

  useEffect(() => {
    if (!isEmpty(tutorInfo) && isFocused) {
      getScheduledClasses({
        variables: {
          classesSearchDto: {
            tutorId: tutorInfo.id,
            startDate: moment().toDate(),
            endDate: moment().endOf('day').toDate(),
          },
        },
      });
      getTutorOffering();
      getAppCarousels();
    }
  }, [tutorInfo, isFocused]);

  const handleUrl = ({ url }) => {
    if (url?.endsWith('/pytn-listing')) {
      navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_REQUESTS);
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL()
      .then((url) => {
        handleUrl({ url });
      })
      .catch((err) => console.error('An error occurred', err));

    return () => Linking.removeEventListener('url', handleUrl);
  }, []);

  const renderSubjects = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate(NavigationRouteNames.TUTOR.ADD_SUBJECT_DETAILS, {
            offering: item,
            tutorId: tutorInfo.id,
          })
        }>
        <View
          style={[
            commonStyles.verticallyStretchedItemsView,
            {
              flex: 0.5,
              backgroundColor: getBoxColor(item?.offering?.displayName),
              padding: RfH(8),
              marginRight: index % 2 === 0 ? RfW(0) : RfW(0),
              marginLeft: index % 2 !== 0 ? RfW(8) : RfW(0),
              marginVertical: RfH(8),
              borderRadius: RfH(8),
            },
          ]}>
          <IconButtonWrapper
            iconWidth={RfW(48)}
            iconHeight={RfH(48)}
            styling={{ alignSelf: 'flex-start' }}
            iconImage={getSubjectIcons(item?.offering?.displayName)}
          />
          <Text
            style={[
              commonStyles.regularPrimaryText,
              { fontFamily: Fonts.semiBold },
            ]}>
            {item?.offering?.displayName}
          </Text>

          <View style={commonStyles.horizontalChildrenView}>
            <Text style={[commonStyles.smallMutedText]}>
              {item?.offerings[2]?.displayName} -{' '}
              {item?.offerings[1]?.displayName}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

   const handleBannerClick = async (bannerItem) => {
     switch (bannerItem.targetScreenName) {
       case BannerTypeEnum.WEB_VIEW.label: {
         let url = null;
         let label=null
         bannerItem.payload.forEach((element) => {
           if ((element.key === 'url')) {
             url = element.value;
           }
           else if (element.key==='label')
           {
             label=element.value
           }
         });
         navigation.navigate(NavigationRouteNames.WEB_VIEW, { url: url,label:label });
         return;
       }
       case BannerTypeEnum.EXTERNAL_LINK.label: {
         let url = null;
         bannerItem.payload.forEach((element) => {
           if ((element.key == 'url')) {
             url = element.value;
           }
         });
         await Linking.openURL(url);
         return;
       }
       case BannerTypeEnum.COMPLETE_PROFILE.label: {
         navigation.navigate(NavigationRouteNames.TUTOR.PROFILE);
         return;
       }
       case BannerTypeEnum.REQUEST_HELP.label: {
         navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
         return;
       }
       case BannerTypeEnum.TUTOR_UPDATE_SCHEDULE.label: {
         navigation.navigate(NavigationRouteNames.TUTOR.UPDATE_SCHEDULE, {
           selectedDate:moment(new Date())});
         return;
       }
       case BannerTypeEnum.TUTOR_UPDATE_PRICE_MATRIX.label: {
          navigation.navigate(NavigationRouteNames.TUTOR.SUBJECTS_LIST);
         return;
       }
       case BannerTypeEnum.TUTOR_SUBJECTS_LIST.label: {
          navigation.navigate(NavigationRouteNames.TUTOR.SUBJECTS_LIST);
         return;
       }
       case BannerTypeEnum.TUTOR_VIEW_SCHEDULE.label: {
         navigation.navigate(NavigationRouteNames.TUTOR.VIEW_SCHEDULE);
         return;
       }
       default:
         return;
     }
   };
  const renderCardItem = (item) => (
    <TouchableOpacity
      style={{
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => handleBannerClick(item)}
      activeOpacity={0.8}>
      <IconButtonWrapper
        iconWidth={ITEM_WIDTH}
        iconHeight={ITEM_HEIGHT}
        styling={{ borderRadius: RfH(8) }}
        imageResizeMode={'contain'}
        iconImage={getDocumentFileUrl(item.attachment.original, userTokenVal)}
        placeHolderImage={Images.empty_classes}
      />
    </TouchableOpacity>
  );

  const pagination = () => (
    <Pagination
      dotsLength={carouselItems.length}
      activeDotIndex={activeSlide}
      containerStyle={{ paddingVertical: RfH(8) }}
      dotStyle={{
        width: RfH(10),
        height: RfH(10),
        borderRadius: RfH(5),
        marginHorizontal: RfW(1),
        backgroundColor: Colors.brandBlue2,
      }}
      inactiveDotStyle={
        {
          // Define styles for inactive dots here
        }
      }
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  );

  const topCarousel = () => (
    <>
      <Carousel
        layout="default"
        data={carouselItems}
        renderItem={({ item, index }) => renderCardItem(item, index)}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setActiveSlide(index)}
        // autoplay
        // autoplayDelay={100}
        // autoplayInterval={5000}
        // loop
      />
      {pagination()}
    </>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Loader isLoading={loadingScheduledClasses || loadingTutorsOffering} />
      <NotificationRedirection />

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: RfW(16),
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NavigationRouteNames.NOTIFICATIONS)
            }
            style={{ paddingLeft: RfW(8) }}>
            <IconButtonWrapper
              iconImage={Images.bell}
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              imageResizeMode="contain"
            />
            {/* <View */}
            {/*  style={{ */}
            {/*    backgroundColor: Colors.orange, */}
            {/*    borderRadius: RfH(20), */}
            {/*    position: 'absolute', */}
            {/*    top: RfH(-10), */}
            {/*    left: RfW(0), */}
            {/*    alignItems: 'center', */}
            {/*    justifyContent: 'center', */}
            {/*    height: RfH(16), */}
            {/*    width: RfH(16), */}
            {/*  }}> */}
            {/*  <Text style={{ fontSize: 10, font: Fonts.bold, color: Colors.white }}>2</Text> */}
            {/* </View> */}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: RfH(20),
              height: RfH(60),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: RfW(16),
            }}>
            <View style={{ flex: 0.7 }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 34,
                  color: Colors.primaryText,
                }}>
                Hi {userInfo?.firstName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 0.3,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate(NavigationRouteNames.TUTOR.PROFILE)
                }>
                <UserImageComponent
                  height={40}
                  width={40}
                  fontSize={16}
                  styling={{ borderRadius: RfH(40) }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {topCarousel()}

          <View style={{ paddingHorizontal: RfW(16) }}>
            {upcomingClasses.length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontFamily: Fonts.bold,
                      fontSize: 20,
                    }}>
                    Upcoming Classes
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate(NavigationRouteNames.CALENDAR)
                    }>
                    <Text
                      style={{
                        color: Colors.brandBlue2,
                        fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                      }}>
                      View All
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={upcomingClasses}
                    renderItem={({ item, index }) => (
                      <UpcomingClassComponent
                        classDetails={item}
                        index={index}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            )}

            {subjects.length > 0 && (
              <View style={{ marginTop: RfH(24) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontFamily: Fonts.bold,
                      fontSize: 20,
                    }}>
                    My Active Subjects
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate(
                        NavigationRouteNames.TUTOR.SUBJECTS_LIST,
                      )
                    }>
                    <Text
                      style={{
                        color: Colors.brandBlue2,
                        fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                      }}>
                      View All
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View
                  style={{
                    marginTop: RfH(8),
                    flex: 1,
                    justifyContent: 'space-between',
                  }}>
                  <FlatList
                    data={subjects.slice(0, 6)}
                    extraData={refreshSubjectList}
                    numColumns={2}
                    renderItem={({ item, index }) =>
                      renderSubjects(item, index)
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            )}

            <View style={commonStyles.blankViewMedium} />
           {!(tutorInfo?.additionalProperties?.covidVaccinated)? <Text style={commonStyles.warningTextColor}>
              You need to get covid vaccinated for taking the offline class.
              Connect us on WhatsApp no 919891587300 to know more
            </Text>:null}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_REQUESTS)
              }
              style={{ marginTop: RfH(20) }}
              activeOpacity={0.8}>
              <Image
                style={{
                  width: deviceWidth() - RfW(32),
                  height: (441 / 1031) * (deviceWidth() - RfW(32)),
                }}
                source={Images.pytn_tutor}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(NavigationRouteNames.REFER_EARN)
              }
              style={{ marginBottom: RfH(15) }}
              activeOpacity={0.8}>
              <Image
                style={{
                  width: deviceWidth() - RfW(32),
                  height: (560 / 1031) * (deviceWidth() - RfW(32)),
                }}
                source={Images.refer_earn_tutor}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TutorSubjectsModal
              visible={showAllSubjects}
              onClose={() => setShowAllSubjects(false)}
              subjects={subjects}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

TutorDashboard.propTypes = {
  changeTab: PropTypes.func,
};

TutorDashboard.defaultProps = {
  changeTab: null,
};

export default TutorDashboard;
