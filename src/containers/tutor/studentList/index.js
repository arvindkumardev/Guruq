import { FlatList, View, Text, Pressable,Image } from 'react-native';
import commonStyles from '../../../theme/styles';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScreenHeader } from '../../../components';
import { Colors, Images, Fonts } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_MY_STUDENT_LIST } from './studentlist.query';
import { styles } from './styles';
import routeNames from '../../../routes/screenNames';
import Loader from '../../../components/Loader';
import StudentItemComponent from './studentitemcomponent';

function StudentListing(props) {
  const { isSubScreen } = props;
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [studentList, setStudentList] = useState([]);
  const [displayNoDataFound, setDisplayNoDataFound] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(50);
  const studentListPadding = isSubScreen ? 100 : 34;
  const [loadStudentList, { loading: studentListLoader }] = useLazyQuery(
    GET_MY_STUDENT_LIST,
    {
      fetchPolicy: 'no-cache',
      onError(e) {
        setDisplayNoDataFound(true);
        console.log("errorn is",e);
      },
      onCompleted(data) {
        if (
          data &&
          data?.getTutorStudents &&
          data?.getTutorStudents.edges.length > 0
        ) {
          console.log("Value of student list is ",data.getTutorStudents.edges)
          setStudentList(data.getTutorStudents.edges);
        } else {
          console.log("data not found")
          setDisplayNoDataFound(true);
        }
      },
    },
  );
  useEffect(() => {
    if (isFocussed) {
      // getting  student list
      loadStudentList({
        variables: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
        },
      });
    }
  }, [isFocussed]);

  const renderItem = (item) => {
    return (
      <StudentItemComponent
        id={item.id.toString()}
        student={item}
        navigation={navigation}
        routeNames={routeNames}
      />
    );
  };
  let labelText = {
    fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
    fontFamily: Fonts.semiBold,
    color: Colors.black,
  };
  if (!displayNoDataFound) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        {isSubScreen ? (
          <View style={styles.subscreenheadingView}>
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
          <ScreenHeader label="Students" homeIcon horizontalPadding={RfW(16)} />
        )}
        <Loader isLoading={studentListLoader} />
        <View>
          <FlatList
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            data={studentList}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: RfH(studentListPadding) }}
          />
        </View>
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
        <ScreenHeader
          label="Students"
          homeIcon
          labelStyle={{
            flexDirection: 'column',
            marginLeft: RfW(8),
          }}
          
        />
      )}
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
