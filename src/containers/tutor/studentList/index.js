import { FlatList, View, Text, Pressable, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { ScreenHeader, IconButtonWrapper } from '../../../components';
import { Colors, Images, Fonts } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_MY_STUDENT_LIST,GET_STUDENT_BY_OFFERING_ID } from './studentlist.query';
import { SEARCH_TUTOR_OFFERINGS } from '../mySubjects/subject.query';
import { styles } from './styles';
import routeNames from '../../../routes/screenNames';
import Loader from '../../../components/Loader';
import StudentItemComponent from './studentitemcomponent';
import TutorStudentFilterComponent from './components/filterComponent';
import { tutorDetails } from '../../../apollo/cache';
import { BackArrow } from '../../../components';

function StudentListing(props) {
  const { isSubScreen, offeringId } = props;
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [studentList, setStudentList] = useState([]);
  const [sizeFlag,setSizeFlag]=useState(false)
    const tutorInfo = useReactiveVar(tutorDetails);
  const [displayNoDataFound, setDisplayNoDataFound] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(50);
 const [showFilterPopup, setShowFilterPopup] = useState(false);
 const [subjectList,setSubjectList]=useState([]);
 const [subjectListEmpty,setIsSubjectListEmpty]=useState(false)
 const [currentSelectedSubject,setCurrentSelectedSubject]=useState(null)
  const studentListPadding = isSubScreen ? 100 : 34;

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(
    SEARCH_TUTOR_OFFERINGS,
    {
      fetchPolicy: 'no-cache',
      variables: { tutorId: tutorInfo.id },
      onError: (e) => {
        console.log(e);
         setIsSubjectListEmpty(subjectsList.length === 0);
      },
      onCompleted: (data) => {
        if (data) {
          const subjectsList = data?.searchTutorOfferings;
          setSubjectList(subjectsList);
          setIsSubjectListEmpty(subjectsList.length === 0);
        }
      },
    },
  );



  

  const [loadStudentList, { loading: studentListLoader }] = useLazyQuery(GET_MY_STUDENT_LIST, {
    fetchPolicy: 'no-cache',
    onError(e) {
      setDisplayNoDataFound(true);
      console.log('errorn is', e);
    },
    onCompleted(data) {
      if (data && data?.getTutorStudents && data?.getTutorStudents.edges.length > 0) {
        setStudentList(data.getTutorStudents.edges);
             setDisplayNoDataFound(false);
      } else {
        setDisplayNoDataFound(true);
      }
    },
  });



  const [loadStudentByOfferingId, { loading: studentFilterLoader }] = useLazyQuery(
    GET_STUDENT_BY_OFFERING_ID,
    {
      fetchPolicy: 'no-cache',
      onError(e) {
        setDisplayNoDataFound(true);
        console.log('errorn is', e);
      },
      onCompleted(data) {
        if (
          data &&
          data?.getTutorStudents &&
          data?.getTutorStudents.edges.length > 0
        ) {
              setDisplayNoDataFound(false);
          if (data.getTutorStudents.edges.length<3)
          {
            setSizeFlag(true)
          }
          if(isSubScreen)
          {
            setStudentList(data.getTutorStudents.edges.slice(0, 3));
                
          }
          else{
              setStudentList(data.getTutorStudents.edges);
          }
          
        } else {
          console.log('data not found');
          setDisplayNoDataFound(true);
        }
      },
    },
  );


  useEffect(() => {
    if (isFocussed) {
      // getting  student list
      if(isSubScreen)
      {
       loadStudentByOfferingId({
         variables: {
              page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            offeringId: parseInt(offeringId, 10),
         },
         });
      }
      else{
        loadStudentList({
           variables: {
          page: parseInt(page, 10),
           limit: parseInt(limit, 10),
         },
        });
      }
    
      getTutorOffering()
    }
  }, [isFocussed]);

  const renderItem = (item) => {
    return (
      <StudentItemComponent
        id={item.id.toString()}
        student={item}
        navigation={navigation}
        currentFilterSubject={currentSelectedSubject}
        routeNames={routeNames}
      />
    );
  };


  const  handleSubjectFilterModal=()=>{
    setShowFilterPopup(false)
  }
  
  const onOfferingSelect = (selectedOffering) => {
    setStudentList([]);
    loadStudentByOfferingId({
      variables: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        offeringId: parseInt(selectedOffering.id, 10),
      },
    });
    setShowFilterPopup(false);
    setCurrentSelectedSubject(selectedOffering.displayName)
  };
  
  const clearSelection=()=>{
    setStudentList([]);
    setShowFilterPopup(false);
    setCurrentSelectedSubject(null)
        loadStudentList({
          variables: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
          },
        });
  }

  const FilterItem=()=>{
      
      return (
      <View>
         <View>
           <View style={styles.filterContainer}>
            {studentList.length>0?<Text
               style={[
                 styles.filterText,
                 { position: 'absolute', left: 0, paddingLeft: 12 },
               ]}>
               {studentList.length} Students
             </Text>:
             <Text
               style={[
                 styles.filterText,
                 { position: 'absolute', left: 0, paddingLeft: 12 },
               ]}>
               0 Students
             </Text>}
             <Pressable
               onPress={() => setShowFilterPopup(true)}
               style={[
                 styles.filterContainer,
                 { position: 'absolute', right: 0, paddingRight: 24 },
               ]}>
               <IconButtonWrapper
                 iconHeight={15}
                 iconWidth={15}
                 iconImage={Images.filter}
               />
               <Text style={[styles.filterText]}>Filters</Text>
             </Pressable>
           </View>
         </View>
         <View style={styles.horizontalLine} />
         {currentSelectedSubject ? (
           <View>
             <Text
               style={[styles.filterText, { paddingLeft: 12, marginTop: 4 }]}>
               {currentSelectedSubject.toUpperCase()}
             </Text>
             <View style={styles.horizontalLine} />
           </View>
         ) : null}
       </View>)
  }


  const onBackPress = () => {
       navigation.goBack();
    }



  if (!displayNoDataFound) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        {isSubScreen ? (
          <View style={styles.subscreenheadingView}>
            <Text style={styles.subscreenheadingText}>My Students</Text>
            {!sizeFlag ? (
              <Pressable
                style={styles.subscreenheadingView}
                onPress={() => {
                  navigation.navigate(routeNames.TUTOR.STUDENT_LISTING);
                }}>
                <Text style={styles.textviewAll}>View All</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: RfW(16),
              paddingVertical: RfH(20),
            }}>
            <BackArrow action={onBackPress} />
            <Text
              style={[
                commonStyles.pageTitleBlackSmall,
                { textAlign: 'center', marginLeft: 10 },
              ]}>
              Students
            </Text>
          </View>
        )}
        <Loader
          isLoading={
            studentListLoader || studentFilterLoader || loadingTutorsOffering
          }
        />
        <View style={{ flex: 1 }}>
          {isSubScreen ? null : <FilterItem />}
          <FlatList
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            data={studentList}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: RfH(studentListPadding) }}
          />
        </View>

        <TutorStudentFilterComponent
          onClose={handleSubjectFilterModal}
          visible={showFilterPopup}
          onSelect={onOfferingSelect}
          offerings={subjectList}
          clearSelection={clearSelection}
        />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      {isSubScreen ? (
        <View style={styles.subscreenheadingView_Two}>
          <Text style={styles.subscreenheadingText}>My Students</Text>
          <Pressable
            style={styles.subscreenheadingView}
            onPress={() => {
              navigation.navigate(routeNames.TUTOR.STUDENT_LISTING);
            }}>
            <Text style={styles.textviewAll}>View All</Text>
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: RfW(16),
            paddingVertical: RfH(20),
          }}>
          <BackArrow action={onBackPress} />
          <Text
            style={[
              commonStyles.pageTitleBlackSmall,
              { textAlign: 'center', marginLeft: 10 },
            ]}>
            Students
          </Text>
        </View>
      )}
      <Loader
        isLoading={
          studentListLoader || studentFilterLoader || loadingTutorsOffering
        }
      />
      <View>
        {/* {isSubScreen ? null : <FilterItem />} */}
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
          No Student Found
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
          Looks like Student haven't booked any class.
        </Text>
        <View style={{ height: RfH(40) }} />

        <TutorStudentFilterComponent
          onClose={handleSubjectFilterModal}
          visible={showFilterPopup}
          onSelect={onOfferingSelect}
          offerings={subjectList}
          clearSelection={clearSelection}
        />
      </View>
    </View>
  );
}
StudentListing.propTypes = {
  isSubScreen: PropTypes.bool,
};

StudentListing.defaultProps = {
  isSubScreen: false,
};

export default StudentListing;
