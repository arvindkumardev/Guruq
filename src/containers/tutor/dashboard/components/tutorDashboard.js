/* eslint-disable import/no-duplicates */
/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
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
import { tutorDetails, userDetails } from '../../../../apollo/cache';
import { IconButtonWrapper, UpcomingClassComponent } from '../../../../components';
import Loader from '../../../../components/Loader';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import { getBoxColor } from '../../../../theme/colors';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { alertBox, deviceWidth, getSubjectIcons, RfH, RfW } from '../../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../../../student/booking.query';
import { GET_TUTOR_OFFERINGS } from '../../../student/tutor-query';
import TutorSubjectsModal from './tutorSubjectsModal';
import CustomImage from '../../../../components/CustomImage';
import UserImageComponent from '../../../../components/UserImageComponent';

const carouselItems = [Images.tutor_home_banner_1, Images.tutor_home_banner_2, Images.tutor_home_banner_3];
function TutorDashboard(props) {
  const navigation = useNavigation();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [refreshSubjectList, setRefreshSubjectList] = useState(false);
  const { changeTab } = props;
  const tutorInfo = useReactiveVar(tutorDetails);
  const userInfo = useReactiveVar(userDetails);

  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.85);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);

  useFocusEffect(() => {
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
  }, []);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setUpcomingClasses(data.getScheduledClasses);
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

  useEffect(() => {
    if (!isEmpty(tutorInfo)) {
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
    }
  }, [tutorInfo]);

  const renderSubjects = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX, {
            offering: item,
            priceMatrix: true,
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
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {item?.offering?.displayName}
          </Text>

          <View style={commonStyles.horizontalChildrenView}>
            <Text style={[commonStyles.smallMutedText]}>
              {item?.offerings[2]?.displayName} - {item?.offerings[1]?.displayName}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderCardItem = (item) => (
    <View style={{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
      <CustomImage
        image={item}
        imageWidth={ITEM_WIDTH}
        imageHeight={ITEM_HEIGHT}
        imageResizeMode="contain"
        styling={{ borderRadius: RfW(3) }}
      />
    </View>
  );

  const pagination = () => (
    <Pagination
      dotsLength={carouselItems.length}
      activeDotIndex={activeSlide}
      containerStyle={{ paddingVertical: RfH(4) }}
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
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
        }}>
        {/* <View style={{ height: RfH(44), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> */}
        {/*  <View style={{ flexDirection: 'row' }} /> */}
        {/*  /!* <View> *!/ */}
        {/*  /!*  <TouchableOpacity onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.NOTIFICATIONS)}> *!/ */}
        {/*  /!*    <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} /> *!/ */}
        {/*  /!*  </TouchableOpacity> *!/ */}
        {/*  /!* </View> *!/ */}
        {/* </View> */}

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
              <Text style={{ fontFamily: Fonts.bold, fontSize: 34, color: Colors.primaryText }}>
                Hi {userInfo?.firstName}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 0.3, justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.PROFILE)}>
                <UserImageComponent height={40} width={40} fontSize={16} styling={{ borderRadius: RfH(40) }} />
              </TouchableWithoutFeedback>
            </View>
          </View>

          {topCarousel()}

          <View style={{ paddingHorizontal: RfW(16) }}>
            {upcomingClasses.length > 0 && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>
                    Upcoming Classes
                  </Text>
                  <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.CALENDAR)}>
                    <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                      View All
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={upcomingClasses}
                    renderItem={({ item, index }) => <UpcomingClassComponent classDetails={item} index={index} />}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            )}

            {subjects.length > 0 && (
              <View style={{ marginTop: RfH(24) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>
                    My Active Subjects
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.SUBJECTS_LIST)}>
                    <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                      View All
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{ marginTop: RfH(8), flex: 1, justifyContent: 'space-between' }}>
                  <FlatList
                    data={subjects.slice(0, 6)}
                    extraData={refreshSubjectList}
                    numColumns={2}
                    renderItem={({ item, index }) => renderSubjects(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            )}

            <View style={commonStyles.blankViewMedium} />

            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.STUDENT_REQUESTS)}
              style={{ marginTop: RfH(20) }}
              activeOpacity={0.8}>
              <Image
                style={{ width: deviceWidth() - RfW(32), height: (441 / 1031) * (deviceWidth() - RfW(32)) }}
                source={Images.pytn_tutor}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.REFER_EARN)}
              style={{ marginBottom: RfH(15) }}
              activeOpacity={0.8}>
              <Image
                style={{ width: deviceWidth() - RfW(32), height: (560 / 1031) * (deviceWidth() - RfW(32)) }}
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
