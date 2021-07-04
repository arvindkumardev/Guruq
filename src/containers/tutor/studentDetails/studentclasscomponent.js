/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList ,TouchableOpacity} from 'react-native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused,useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import Loader from '../../../components/Loader';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { getFullName, RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { styles } from './styles';
import { SEARCH_ORDER_ITEMS } from '../../student/booking.query';
import { SEARCH_REVIEW } from '../../student/tutor-query';
import TutorImageComponent from '../../../components/TutorImageComponent';
import NavigationRouteNames from '../../../routes/screenNames';
import { tutorDetails } from '../../../apollo/cache';
import RatingView from './ratingview'

const StudentClassComponent = ({ student, subject }) => {
  const navigation = useNavigation();
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const isFoucsed = useIsFocused();
  const [orderList, setOrderList] = useState([]);
  const tutorInfo = useReactiveVar(tutorDetails);
  const [reviewArray,setReviewArray]=useState([])
  console.log('Rohit tutor user info is ', tutorInfo);
  console.log("Rohit student details is ",student)
    console.log('Rohit subject ', subject);

  const [searchOrderItems, { loading: loadingBookings }] = useLazyQuery(SEARCH_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      setIsEmpty(true);
    },
    onCompleted: (data) => {
      if (data && data?.searchOrderItems && data?.searchOrderItems.edges.length > 0) {
        setIsEmpty(false);
        setOrderList(data?.searchOrderItems.edges);
      } else {
        setIsEmpty(true);
        setOrderList([]);
      }
    },
  });


 const [searchCurrentStudentReview, { loading: loadCurrentStudentReview }] = useLazyQuery(
   SEARCH_REVIEW,
   {
     fetchPolicy: 'no-cache',
     onError: (e) => {
       console.log(e);
     },
     onCompleted: (data) => {
       if (data && data?.searchReview && data?.searchReview.edges.length > 0) {
         setReviewArray(data.searchReview.edges);
       }
     },
   },
 );


  const onClicked = (isHistory) => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          ownerId: student.user.id,
          offeringId: subject.id,
          showActive: true,
          showHistory: isHistory,
          showWithAvailableClasses: !isHistory,
          size: 2,
        },
      },
    });
    setIsHistorySelected(isHistory);
  };


  useEffect(() => {
    console.log("Rohit api called again",subject)
    setReviewArray([])
    searchCurrentStudentReview({
      variables: {
        reviewSearchDto: {
          tutorId: tutorInfo.id,
          createdById: student.user.id,
          sortBy: 'createdDate',
          sortOrder: 'DSC',
          offeringId: subject.id,
        },
      },
    });
  }, [subject]);

  useEffect(() => {
    if (isFoucsed) {
      searchOrderItems({
        variables: {
          bookingSearchDto: {
            ownerId: student.user.id,
            offeringId: subject.id,
            showActive: true,
            showHistory: false,
            showWithAvailableClasses: !false,
            size: 2,
          },
        },
      });
      searchCurrentStudentReview({
        variables: {
          reviewSearchDto: {
            tutorId: tutorInfo.id,
            createdById: student.user.id,
            sortBy: 'createdDate',
            sortOrder: 'DSC',
            offeringId:subject.id
          },
        },
      });
      setIsHistorySelected(false);
    }
  }, [isFoucsed]);

  // use effect to track subject change
  useEffect(() => {
    setIsHistorySelected(false);
    setOrderList([]);
    setIsEmpty([]);
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          ownerId: student.user.id,
          offeringId: subject.id,
          showActive: true,
          showHistory: false,
          showWithAvailableClasses: !false,
          size: 2,
        },
      },
    });
  }, [subject]);

  const renderClassItem = (item) => {
    return (
      <View style={{ marginTop: RfH(30) }}>
        <Text style={commonStyles.headingPrimaryText}>
          {item.offering.displayName}
        </Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text
            style={{
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
            }}>
            {item.offering?.parentOffering?.parentOffering?.displayName}
            {' | '}
            {item.offering?.parentOffering?.displayName}
          </Text>
          <Text
            style={[
              commonStyles.mediumPrimaryText,
              { color: Colors.brandBlue2 },
            ]}>
            {moment(item.createdDate).format('DD-MMM-YYYY')}
          </Text>
          {item.demo && (
            <Text style={commonStyles.mediumPrimaryText}>Demo Class</Text>
          )}
        </View>
        <View
          style={{
            borderBottomColor: Colors.darkGrey,
            borderBottomWidth: 0.5,
            marginTop: RfH(8),
          }}
        />
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            { marginTop: RfH(8) },
          ]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <TutorImageComponent
                tutor={item?.tutor}
                styling={{
                  borderRadius: RfH(32),
                  width: RfH(64),
                  height: RfH(64),
                }}
              />
            </View>
            <View
              style={[
                commonStyles.verticallyStretchedItemsView,
                { marginLeft: RfW(8) },
              ]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                  color: Colors.black,
                  lineHeight: 21,
                }}>
                {getFullName(student?.contactDetail)}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                }}>
                {item.onlineClass ? 'Online' : 'Home Tuition'} - Individual
                Class
              </Text>
            </View>
          </View>
          <View
            style={[
              commonStyles.verticallyCenterItemsView,
              {
                borderRadius: 8,
                paddingHorizontal: RfW(8),
                backgroundColor: Colors.lightBlue,
              },
            ]}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                {
                  backgroundColor: Colors.lightBlue,
                  paddingHorizontal: RfW(8),
                },
              ]}>
              {item.count}
            </Text>
            <Text
              style={{
                fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
                color: Colors.black,
                paddingBottom: RfH(8),
              }}>
              Classes
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: Colors.darkGrey,
            marginTop: 8,
            borderBottomWidth: 0.5,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <View style={[commonStyles.mainContainer]}>
        <Loader isLoading={loadingBookings || loadCurrentStudentReview} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}>
          <View>
            <View style={[commonStyles.horizontalChildrenCenterView]}>
              <Button
                onPress={() => onClicked(false)}
                small
                block
                bordered
                style={
                  isHistorySelected
                    ? styles.inactiveLeftButton
                    : styles.activeLeftButton
                }>
                <Text
                  style={
                    isHistorySelected
                      ? styles.inactiveButtonText
                      : styles.activeButtonText
                  }>
                  Unscheduled Classes
                </Text>
              </Button>
              <Button
                onPress={() => onClicked(true)}
                small
                block
                bordered
                style={
                  isHistorySelected
                    ? styles.activeRightButton
                    : styles.inactiveRightButton
                }>
                <Text
                  style={
                    isHistorySelected
                      ? styles.activeButtonText
                      : styles.inactiveButtonText
                  }>
                  History
                </Text>
              </Button>
            </View>
          </View>
          {!isEmpty ? (
            <View
              style={{
                height: 'auto',
                flexGrow: 0,
                marginBottom: RfH(38),
              }}>
              <FlatList
                style={{ flexGrow: 0, height: 'auto' }}
                showsVerticalScrollIndicator={false}
                data={orderList}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: RfH(16) }}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(NavigationRouteNames.MY_CLASSES);
                }}>
                <Text
                  style={[
                    commonStyles.mediumPrimaryText,
                    { alignSelf: 'flex-end', color: Colors.brandBlue2 },
                  ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Image
                source={Images.empty_classes}
                style={{
                  margin: RfH(56),
                  alignSelf: 'center',
                  height: RfH(200),
                  width: RfW(216),
                  marginBottom: RfH(32),
                }}
              />
              <Text
                style={[
                  commonStyles.pageTitleThirdRow,
                  {
                    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
                    textAlign: 'center',
                  },
                ]}>
                No class found
              </Text>
              {!isHistorySelected ? (
                <Text
                  style={[
                    commonStyles.regularMutedText,
                    {
                      marginHorizontal: RfW(60),
                      textAlign: 'center',
                      marginTop: RfH(16),
                    },
                  ]}>
                  Looks like Student don't have Unscheduled Classes.
                </Text>
              ) : (
                <Text
                  style={[
                    commonStyles.regularMutedText,
                    {
                      marginHorizontal: RfW(60),
                      textAlign: 'center',
                      marginTop: RfH(16),
                    },
                  ]}>
                  Looks like Student don't have Class History.
                </Text>
              )}

              <View style={{ height: RfH(40) }} />
            </View>
          )}
          {reviewArray.length>0?<RatingView student={student} reviewArray={reviewArray}/>:null}
        </ScrollView>
      </View>
    </>
  );
};

export default StudentClassComponent;
