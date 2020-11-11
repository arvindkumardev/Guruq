/* eslint-disable no-nested-ternary */
import { Text, View, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import ProgressCircle from 'react-native-progress-circle';
import { Button, Icon } from 'native-base';
import CalendarStrip from 'react-native-calendar-strip';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { IconButtonWrapper } from '../../../components';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import routeNames from '../../../routes/screenNames';

function tutorDetails() {
  const navigation = useNavigation();
  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: 0, name: 'English' },
    { id: 1, name: 'Physics' },
    { id: 2, name: 'Chemistry' },
    { id: 3, name: 'Biology' },
  ]);

  const [reviewProgress, setReviewProgress] = useState([
    { typeName: 'Course Understanding', image: Images.understanding, percentage: 70 },
    { typeName: 'Helpfulness', image: Images.chat, percentage: 60 },
    { typeName: 'Professional Attitude', image: Images.professional, percentage: 100 },
    { typeName: 'Teaching Methodology', image: Images.methodology, percentage: 90 },
    { typeName: 'Accessibility', image: Images.thumb_range, percentage: 70 },
    { typeName: 'Improvement in Results', image: Images.stats, percentage: 90 },
  ]);

  const [userReviews, setUserReviews] = useState([
    {
      name: 'Simranpreet',
      icon: Images.user,
      rating: 5,
      date: '20 Aug',
      description: 'The sessions with tutors stimulate the mind & bring in being at school feeling as well.',
    },
    {
      name: 'Usman Saif',
      icon: Images.kushal,
      rating: 5,
      date: '18 Aug',
      description: 'The sessions with tutors stimulate the mind & bring in being at school feeling as well.',
    },
  ]);

  const [markedDates, setMarkedDates] = useState([
    {
      date: ['03/11/2020'],
      dots: [
        {
          color: Colors.brandBlue2,
        },
      ],
    },
  ]);

  const [availableSlots, setAvailableSlots] = useState([
    '09:30 - 10:30 AM',
    '10:30 - 11:30 AM',
    '01:30 - 02:30 PM',
    '03:00 - 04:00 PM',
    '04:00 - 05:00 PM',
    '05:00 - 06:00 PM',
  ]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderSubjects = (item, index) => {
    return (
      <View style={{ marginTop: RfH(20), flex: 1 }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: index === 0 ? Colors.lightPurple : Colors.lightGrey,
            height: RfH(67),
            width: RfW(70),
            marginHorizontal: RfW(4),
            borderRadius: RfW(8),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(24.5)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(34.2)}
            iconImage={Images.book}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            width: RfW(70),
            color: Colors.primaryText,
            marginTop: RfH(5),
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  const renderProgress = (item) => {
    return (
      <View style={{ flex: 0.33, alignItems: 'center', marginTop: RfH(16) }}>
        <ProgressCircle
          percent={item.percentage}
          radius={32}
          borderWidth={6}
          color="rgb(203,231,255)"
          shadowColor={Colors.lightGrey}
          bgColor={Colors.white}>
          <IconButtonWrapper iconWidth={RfW(22)} iconImage={item.image} />
        </ProgressCircle>
        <Text
          style={{
            fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
            textAlign: 'center',
            marginTop: RfH(8),
            color: Colors.darkGrey,
          }}>
          {item.typeName}
        </Text>
      </View>
    );
  };

  const renderReviews = (item) => {
    return (
      <View
        style={{
          // width: RfW(216),
          // marginBottom: RfH(16),
          paddingHorizontal: RfW(16),
          // backgroundColor: Colors.lightGrey,
          // borderRadius: 8,
          // padding: 8,
          // marginRight: RfW(8),
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <IconButtonWrapper
            iconHeight={RfH(40)}
            iconWidth={RfW(40)}
            iconImage={item.icon}
            styling={{ borderRadius: 20 }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: RfW(8),
            }}>
            <Text style={{ fontFamily: 'SegoeUI-Semibold' }}>{item.name}</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item.date} |{' '}
              <IconButtonWrapper
                iconWidth={RfW(10)}
                iconHeight={RfH(10)}
                iconImage={Images.golden_star}
                styling={{ alignSelf: 'center' }}
              />{' '}
              {parseFloat(item.rating).toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: RfH(8), color: Colors.darkGrey }}>{item.description}</Text>

        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
      </View>
    );
  };

  const classView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: RfW(16),
          paddingVertical: RfW(16),
        }}>
        <View style={{ alignItems: 'center' }}>
          <Icon
            type="FontAwesome"
            name="user"
            style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
          />
          <Text style={styles.tutorDetails}>Individual</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Icon type="FontAwesome" name="users" style={{ fontSize: 15, marginRight: RfW(4), color: Colors.darkGrey }} />
          <Text style={styles.tutorDetails}>Group Classes</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Icon
            type="FontAwesome"
            name="question"
            style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
          />
          <Text style={styles.tutorDetails}>Free Demo</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Icon type="FontAwesome" name="tv" style={{ fontSize: 15, marginRight: RfW(4), color: Colors.darkGrey }} />
          <Text style={styles.tutorDetails}>Online</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Icon
            type="FontAwesome"
            name="home"
            style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
          />
          <Text style={styles.tutorDetails}>Home Tution</Text>
        </View>
      </View>
    );
  };

  const renderPriceMatrix = () => {
    return (
      <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfW(16) }}>
        <View>
          <Text style={[commonStyles.titleText]}>Price Matrix - English</Text>
        </View>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              marginTop: RfH(16),
            },
          ]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Classes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50</Text>
          </View>
        </View>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              marginTop: RfH(16),
            },
          ]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Online Classes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50</Text>
          </View>
        </View>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              marginTop: RfH(16),
            },
          ]}>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.tutorDetails}>Home Tutions</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={styles.tutorDetails}>1</Text>
            <Text style={styles.tutorDetails}>5</Text>
            <Text style={styles.tutorDetails}>10</Text>
            <Text style={styles.tutorDetails}>25</Text>
            <Text style={styles.tutorDetails}>50</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRatingsReviews = () => {
    return (
      <View>
        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Rating and Reviews</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenView, { marginVertical: RfH(16), marginHorizontal: RfW(16) }]}>
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={Images.golden_star} />
          <Text
            style={[
              styles.tutorName,
              {
                marginHorizontal: RfW(16),
                fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
              },
            ]}>
            {parseFloat(5).toFixed(1)}
          </Text>
        </View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <FlatList
            numColumns={3}
            data={reviewProgress}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderProgress(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={{ marginBottom: RfH(34) }}>
          <FlatList
            // vertical
            data={userReviews}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderReviews(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  const renderSlots = (item) => {
    return (
      <View
        style={{
          backgroundColor: Colors.lightGreen,
          padding: 8,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(4),
          marginVertical: RfH(4),
        }}>
        <Text style={{ alignSelf: 'center', fontSize: RFValue(14, STANDARD_SCREEN_SIZE) }}>{item}</Text>
      </View>
    );
  };

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0, paddingBottom: RfH(34) },
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.topView,
            {
              backgroundColor: Colors.white,
              height: RfH(88),
              paddingTop: RfH(44),
              paddingHorizontal: RfW(16),
              alignItems: 'center',
            },
          ]}>
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            iconImage={Images.backArrow}
            submitFunction={() => onBackPress()}
          />
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.rectangle} />
            <IconButtonWrapper
              iconWidth={RfW(16)}
              iconHeight={RfH(16)}
              iconImage={Images.heart}
              styling={{ marginHorizontal: RfW(16) }}
            />
            <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.share} />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingHorizontal: RfW(16),
            // height: RfH(54),
            marginBottom: RfH(17),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(98)}
            iconHeight={RfH(98)}
            iconImage={Images.kushal}
            imageResizeMode="cover"
            styling={{ alignSelf: 'center', borderRadius: RfW(64) }}
          />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={styles.tutorName}>Gurbani Singh</Text>
            <Text style={styles.tutorDetails}>GURUQT133567</Text>
            <Text style={[styles.tutorDetails, { color: Colors.primaryText }]}>Bachelor of Mass Communication</Text>
            <Text style={[styles.tutorDetails, { color: Colors.primaryText }]}>3 years of Teaching Experience </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RfH(8) }}>
              <Icon
                type="FontAwesome"
                name="star"
                style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
              />
              <Text style={styles.chargeText}>3.5</Text>
            </View>
          </View>
        </View>

        <View style={commonStyles.lineSeparator} />

        {classView()}

        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        {/* <View style={{ marginHorizontal: RfW(16), marginVertical: RfH(16) }}> */}
        {/*  <Text style={commonStyles.titleText}>Educational Qualification</Text> */}
        {/*  <Text style={[styles.tutorDetails, { marginTop: RfH(8) }]}>Mass Communication</Text> */}
        {/* </View> */}

        <View style={commonStyles.lineSeparator} />
        {/* <View style={[commonStyles.blankViewSmall, { backgroundColor: Colors.lightGrey }]} /> */}
        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Subjects</Text>
          <View style={{ marginBottom: RfH(16), paddingHorizontal: RfW(16) }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={subjects}
              renderItem={({ item, index }) => renderSubjects(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        {/* <View style={[commonStyles.blankViewSmall, { backgroundColor: Colors.lightGrey }]} /> */}
        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        {renderPriceMatrix()}

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View>
          <TouchableWithoutFeedback onPress={() => setShowDateSlotModal(true)}>
            <Text
              style={[
                styles.tutorName,
                { marginHorizontal: RfW(16), marginVertical: RfH(16), color: Colors.brandBlue2 },
              ]}>
              View Availability of Classes
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        {renderRatingsReviews()}
      </ScrollView>

      <View style={commonStyles.lineSeparator} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: RfH(8),
          paddingHorizontal: RfW(16),
        }}>
        <Button
          onPress={() => navigation.navigate(routeNames.STUDENT.SELECT_CLASS_MODE)}
          style={[commonStyles.buttonOutlinePrimary, { width: RfW(144) }]}>
          <Text style={commonStyles.textButtonOutlinePrimary}>Book [Free] Demo</Text>
        </Button>

        <Button
          onPress={() => navigation.navigate(routeNames.STUDENT.SELECT_CLASS_MODE)}
          style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
        </Button>
      </View>

      <Modal
        animationType="fade"
        backdropOpacity={1}
        transparent
        visible={showDateSlotModal}
        onRequestClose={() => {
          setShowDateSlotModal(false);
        }}>
        <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            opacity: 1,
            paddingBottom: RfH(34),
          }}>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
            iconImage={Images.cross}
            submitFunction={() => setShowDateSlotModal(false)}
          />
          <View style={{ paddingHorizontal: RfW(16) }}>
            <CalendarStrip
              calendarHeaderStyle={{
                fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
                alignSelf: 'flex-start',
                paddingBottom: RfH(8),
              }}
              highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
              highlightDateNameStyle={{ color: Colors.brandBlue2 }}
              disabledDateNameStyle={{ color: Colors.darkGrey }}
              disabledDateNumberStyle={{ color: Colors.darkGrey }}
              dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
              dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
              style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
              calendarAnimation={{ type: 'parallel', duration: 300 }}
              daySelectionAnimation={{ type: 'background', highlightColor: Colors.lightBlue }}
              markedDates={[
                ...markedDates,
                {
                  date: new Date(),
                  dots: [
                    {
                      color: Colors.brandBlue,
                      selectedColor: Colors.brandBlue,
                    },
                  ],
                },
              ]}
              onHeaderSelected={(a) => console.log(a)}
            />
          </View>
          <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(48) }}>
            <Text style={{ fontFamily: 'SegoeUI-Bold', fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Select Slot</Text>
          </View>
          <View style={{ alignItems: 'center', paddingTop: RfH(24) }}>
            <FlatList
              data={availableSlots}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderSlots(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default tutorDetails;
