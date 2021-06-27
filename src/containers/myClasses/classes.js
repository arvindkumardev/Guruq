import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View,Pressable } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SelectSubjectModal, TutorImageComponent ,IconButtonWrapper} from '../../components';
import Loader from '../../components/Loader';
import { Colors, Fonts, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { getFullName, RfH, RfW } from '../../utils/helpers';
import { SEARCH_ORDER_ITEMS } from '../student/booking.query';
import styles from './styles';
import { GET_TUTOR_OFFERINGS } from '../student/tutor-query';
import {
  GET_MY_STUDENT_LIST,
  GET_STUDENT_BY_OFFERING_ID,
} from '../tutor/studentList/studentlist.query';
import { SEARCH_TUTOR_OFFERINGS } from '../tutor/mySubjects/subject.query';
import AddToCartModal from '../student/tutorDetails/components/addToCartModal';
import NavigationRouteNames from '../../routes/screenNames';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';
import { tutorDetails } from '../../apollo/cache';
import moment from 'moment'
import ClassesFilterComponent from './components/filtercomponent';
import StudentFilterComponent from './components/studentfilter';

function MyClasses(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const tab = props?.route?.params?.tab;
  const isHistory = tab === 'history';
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [renewClassObj, setRenewClassObj] = useState({});
  const [selectedSubject, setSelectedSubject] = useState({});
  const [openClassModal, setOpenClassModal] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(1000);
  const [showSubjectFilter,setShowSubjectFilter]=useState(false)
  const [showStudentFilter, setShowStudentFilter] = useState(false);
  const [subjectList,setSubjectList]=useState([])
  const [subjectListEmpty,setSubjectListEmpty]=useState(false)
  const [currentSelectedSubject,setCurrentSelectedSubject]=useState(null)
  const [currentSelectedStudent,setCurrentSelectedStudent]=useState(null)
  const [studentList,setStudentList]=useState([])
  const [studentListEmpty,setStudentListEmpty]=useState(false)


      const tutorInfo = useReactiveVar(tutorDetails);
  const [searchOrderItems, { loading: loadingBookings }] = useLazyQuery(SEARCH_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      setIsEmpty(true);
    },
    onCompleted: (data) => {
      if (data && data?.searchOrderItems && data?.searchOrderItems.edges.length > 0) {
        setIsEmpty(false);
        setOrderItems(data?.searchOrderItems.edges);
        console.log("Arun search order items are ",data)
        setRefreshData(true);
      } else {
        setIsEmpty(true);
        setOrderItems([]);
        setRefreshData(true);
      }
    },
  });
  const [loadStudentList, { loading: studentListLoader }] = useLazyQuery(
    GET_MY_STUDENT_LIST,
    {
      fetchPolicy: 'no-cache',
      onError(e) {
        setStudentListEmpty(true);
        console.log('errorn is', e);
      },
      onCompleted(data) {
        if (
          data &&
          data?.getTutorStudents &&
          data?.getTutorStudents.edges.length > 0
        ) {
          console.log('Value of student list is ', data.getTutorStudents.edges);
          setStudentList(data.getTutorStudents.edges);
        } else {
          console.log('data not found');
          setStudentListEmpty(true);
        }
      },
    },
  );

const [getTutorSubject, { loading: loadingTutorsOffering }] = useLazyQuery(
  SEARCH_TUTOR_OFFERINGS,
  {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo.id },
    onError: (e) => {
      console.log(e);
      setSubjectListEmpty(subjectsList.length === 0);
    },
    onCompleted: (data) => {
      if (data) {
        const subjectsList = data?.searchTutorOfferings;
        setSubjectList(subjectsList);
        setSubjectListEmpty(subjectsList.length === 0);
      }
    },
  },
);

  const [getTutorOffering, { loading: loadTutorSubject }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        // const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const selectedOffering = data?.getTutorOfferings.find((sub) => sub.offering.id === renewClassObj.offering.id);
        if (selectedOffering) {
          setSelectedSubject({
            id: selectedOffering.offering.id,
            displayName: selectedOffering.offering.displayName,
            offeringId: selectedOffering.id,
            demoClass: selectedOffering.demoClass,
            freeDemo: selectedOffering.freeDemo,
            groupClass: selectedOffering.groupClass === 0 || selectedOffering.groupClass === 1,
            onlineClass: selectedOffering.onlineClass === 0 || selectedOffering.onlineClass === 1,
            individualClass: selectedOffering.groupClass === 0 || selectedOffering.groupClass === 2,
            offlineClass: selectedOffering.onlineClass === 0 || selectedOffering.onlineClass === 2,
            budgetDetails: selectedOffering.budgets,
          });
          setOpenClassModal(true);
        }
      }
    },
  });
  useEffect(() => {
    if (isFocussed) {
      searchOrderItems({
        variables: {
          bookingSearchDto: {
            showActive: true,
            showHistory: isHistory,
            showWithAvailableClasses: !isHistory,
            size: 100,
          },
        },
      });
      setIsHistorySelected(isHistory);
      getTutorSubject();
        loadStudentList({
          variables: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
          },
        });
    }
  }, [isFocussed]);

  const goToScheduleClasses = (item) => {
    navigation.navigate(NavigationRouteNames.SCHEDULE_CLASS, { classData: item });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollPosition > 30);
  };

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const onClicked = (isHistory) => {
    searchOrderItems({
      variables: {
        bookingSearchDto: {
          // orderStatus: OrderStatus.COMPLETE.label,
          showActive: true,
          showHistory: isHistory,
          showWithAvailableClasses: !isHistory,
          size: 100
        },
      },
    });
    setIsHistorySelected(isHistory);
  };
  const renewClass = (item) => {
    setRenewClassObj(item);
    getTutorOffering({
      variables: { tutorId: item.tutor.id },
    });
  };

  const tutorDetail = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorId: item.tutor.id,
      currentOffering: item?.offering,
      parentOffering: item.offering?.parentOffering?.id,
      parentParentOffering: item.offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: item.offering?.parentOffering?.displayName,
      parentParentOfferingName: item.offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const handleRightButton = (item) => {
    if (!isStudent) {
      goToScheduleClasses(item);
    } else if (isHistorySelected) {
      renewClass(item);
    } else {
      goToScheduleClasses(item);
    }
  };

  const rightButtonText = () => {
    if (!isStudent) {
      return 'View Details';
    }
    if (isHistorySelected) {
      return 'Renew Class';
    }
    return 'Schedule Class';
  };



  const handleStudentClose=()=>{
    setShowStudentFilter(false)
  }
   const onStudentSelection=(selectedStudent)=>{
     searchOrderItems({
       variables: {
         bookingSearchDto: {
           // orderStatus: OrderStatus.COMPLETE.label,
           showActive: true,
           showHistory: isHistorySelected,
           showWithAvailableClasses: !isHistorySelected,
           size: 100,
           ownerId: selectedStudent.user.id,
         },
       },
     });
     setCurrentSelectedStudent(selectedStudent);
    setCurrentSelectedSubject(null)
    setShowStudentFilter(false);
  }
   const clearStudentSelection=()=>{
         setShowStudentFilter(false);
        setCurrentSelectedStudent(null);
        if(currentSelectedSubject===null){
          onClicked(isHistorySelected);
        }
        
  }
   const handleSubjectClose=()=>{
    setShowSubjectFilter(false);
  }
  const onSubjectSelection=(selectedOffering)=>{
        searchOrderItems({
          variables: {
            bookingSearchDto: {
              // orderStatus: OrderStatus.COMPLETE.label,
              showActive: true,
              showHistory: isHistorySelected,
              showWithAvailableClasses: !isHistorySelected,
              size: 100,
              offeringId: selectedOffering?.id,
            },
          },
        });
        setShowSubjectFilter(false);
         setCurrentSelectedStudent(null);
        setCurrentSelectedSubject(selectedOffering)
  }
  const clearSubjectSelection=()=>{
        setShowSubjectFilter(false);
        setSelectedSubject(null)
        setCurrentSelectedSubject(null);
        onClicked(isHistorySelected);
  }
    
 const FilterItem = () => {
   return (
     <View style={{ marginTop: RfH(16) }}>
       <View>
         <View style={styles.filterContainer}>
           <Pressable
             onPress={() => setShowStudentFilter(true)}
             style={[
               styles.filterContainer,
               { position: 'absolute', left: 0, paddingRight: 24 },
             ]}>
             <IconButtonWrapper
               iconHeight={15}
               iconWidth={15}
               iconImage={Images.filter}
             />
             <Text style={[styles.filterText]}>Student</Text>
           </Pressable>

           <Pressable
             onPress={() => setShowSubjectFilter(true)}
             style={[
               styles.filterContainer,
               { position: 'absolute', right: 0, paddingRight: 24 },
             ]}>
             <IconButtonWrapper
               iconHeight={15}
               iconWidth={15}
               iconImage={Images.filter}
             />
             <Text style={[styles.filterText]}>Subject</Text>
           </Pressable>
         </View>
       </View>
       <View style={styles.horizontalLine} />
       {currentSelectedSubject ? (
         <View>
           <Text style={[styles.filterText, { paddingLeft: 12, marginTop: 4 }]}>
             {currentSelectedSubject.displayName.toUpperCase()}
           </Text>
           <View style={styles.horizontalLine} />
         </View>
       ) : null}
       {currentSelectedStudent ? (
         <View>
           <Text style={[styles.filterText, { paddingLeft: 12, marginTop: 4 }]}>
             {currentSelectedStudent?.contactDetail?.firstName}{' '}{currentSelectedStudent?.contactDetail?.lastName}
           </Text>
           <View style={styles.horizontalLine} />
         </View>
       ) : null}
     </View>
   );
 };





  const renderClassItem = (item) => {
    
    return (
      <View style={{ marginTop: RfH(30) }}>
        <Text style={commonStyles.headingPrimaryText}>{item.offering.displayName}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.offering?.parentOffering?.parentOffering?.displayName}
            {' | '}
            {item.offering?.parentOffering?.displayName}
          </Text>
          {!isHistorySelected && isStudent && item.availableClasses < 3 && !item.demo && (
            <TouchableOpacity activeOpacity={0.6} onPress={() => renewClass(item)}>
              <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2 }]}>Renew Class</Text>
            </TouchableOpacity>
          )}
          {item.demo && <Text style={commonStyles.mediumPrimaryText}>Demo Class</Text>}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <TouchableOpacity
            style={commonStyles.horizontalChildrenStartView}
            onPress={() => tutorDetail(item)}
            activeOpacity={0.8}
            disabled={!isStudent}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <TutorImageComponent
                tutor={
                  isStudent
                    ? item?.tutor
                    : { contactDetail: item?.createdBy, profileImage: item?.createdBy?.profileImage }
                }
                styling={{ borderRadius: RfH(32), width: RfH(64), height: RfH(64) }}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: Fonts.semiBold,
                  marginTop: RfH(2),
                }}>
                {isStudent ? `${getFullName(item.tutor.contactDetail)}` : `${getFullName(item?.createdBy)}`}
              </Text>
              {isStudent && (
                <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                  T-{item.tutor.id}
                </Text>
              )}
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.onlineClass ? 'Online' : 'Home Tuition'} - Individual Class
              </Text>
            </View>
          </TouchableOpacity>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {item.count}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: isHistorySelected ? (isStudent ? 'space-between' : 'flex-end') : 'flex-end',
            alignItems: 'center',
          }}>
          {isHistorySelected && isStudent && (
            <TouchableOpacity activeOpacity={0.6} onPress={() => goToScheduleClasses(item)}>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>
                View Details
              </Text>
            </TouchableOpacity>
          )}
          {!isHistorySelected && (
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                textAlign: 'right',
                color: Colors.darkGrey,
              }}>
              {item.availableClasses} Unscheduled {item.availableClasses === 1 ? 'Class' : 'Classes'}
            </Text>
          )}
          <Button
            onPress={() => handleRightButton(item)}
            style={[
              commonStyles.buttonPrimary,
              {
                alignSelf: 'flex-end',
                marginRight: RfH(0),
                marginLeft: RfW(16),
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>{rightButtonText()}</Text>
          </Button>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5 }} />
      </View>
    );
  };

  return (
    <>
      <Loader isLoading={loadingTutorsOffering || loadingBookings} />
      <View
        style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <View
          style={{
            height: RfH(44),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {showHeader && (
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { alignSelf: 'center' },
              ]}>
              My Classes
            </Text>
          )}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => handleScroll(event)}
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}>
          <View>
            <Text style={commonStyles.pageTitleBlack}>My Classes</Text>
          </View>
          <View>
            <View
              style={[
                commonStyles.horizontalChildrenCenterView,
                showHeader
                  ? { backgroundColor: Colors.white, paddingBottom: RfH(8) }
                  : { paddingTop: RfH(16), backgroundColor: Colors.white },
              ]}>
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
          <StudentFilterComponent
            onClose={handleStudentClose}
            visible={showStudentFilter}
            onSelect={onStudentSelection}
            students={studentList}
            clearSelection={clearStudentSelection}
            title={'Choose A Student'}
            isStudent={true}
            currentStudent={currentSelectedStudent}
          />
          <ClassesFilterComponent
            onClose={handleSubjectClose}
            visible={showSubjectFilter}
            onSelect={onSubjectSelection}
            offerings={subjectList}
            clearSelection={clearSubjectSelection}
            title={'Choose A Subject'}
            isStudent={false}
            currentSubject={currentSelectedSubject}
          />
          <View>
            {!isEmpty ? (
              <FlatList
                ListHeaderComponent={FilterItem}
                showsVerticalScrollIndicator={false}
                data={orderItems}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
                extraData={refreshData}
            
              />
            ) : (
              <View>
              <FilterItem/>
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
                <Text
                  style={[
                    commonStyles.regularMutedText,
                    {
                      marginHorizontal: RfW(60),
                      textAlign: 'center',
                      marginTop: RfH(16),
                    },
                  ]}>
                  {isStudent
                    ? "Looks like you haven't booked any class."
                    : "Looks like you don't have any booked classes."}
                </Text>
                <View style={{ height: RfH(40) }} />
                {isStudent && (
                  <Button
                    block
                    style={[
                      commonStyles.buttonPrimary,
                      { alignSelf: 'center' },
                    ]}
                    onPress={() => setShowAllSubjects(true)}>
                    <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
                  </Button>
                )}
              </View>
            )}
          </View>
        </ScrollView>
        {openClassModal && (
          <AddToCartModal
            visible={openClassModal}
            onClose={() => setOpenClassModal(false)}
            selectedSubject={selectedSubject}
            isDemoClass={false}
            noOfClass={renewClassObj.count}
            isOnlineRenewal={renewClassObj.onlineClass}
            isRenewal
          />
        )}

        <SelectSubjectModal
          onClose={() => setShowAllSubjects(false)}
          onSelectSubject={gotoTutors}
          visible={showAllSubjects}
        />
      </View>
    </>
  );
}

export default MyClasses;
