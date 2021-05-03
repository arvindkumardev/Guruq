import { FlatList, View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import { ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { GET_TUTOR_STUDENT_SUBJECTS } from './studentdetail.query';
import Loader from '../../../components/Loader';
import SubjectItemComponent from './subjectitemcomponent';
import StudentTopProfileComponent from '../../../components/StudentTopProfileComponent';
import StudentClassComponent from './studentclasscomponent';

const StudentDetails = (props) => {
  const { route } = props;
  const student = route?.params.student;
  const [selectedSubject, setSelectedSubject] = useState(null);
  const isFocussed = useIsFocused();
  const [subjects, setSubjects] = useState([]);

  const [loadSubjectList, { loading: subjectLoader }] = useLazyQuery(GET_TUTOR_STUDENT_SUBJECTS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data && data?.getTutorStudentSubjects && data?.getTutorStudentSubjects.length > 0) {
        setSubjects(data.getTutorStudentSubjects);
        setSelectedSubject(data.getTutorStudentSubjects[0]);
      } else {
        selectedSubject(null);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      loadSubjectList({
        variables: {
          studentId: parseInt(student.id, 10),
        },
      });
    }
  }, [isFocussed]);

  const renderItem = (item) => {
    return (
      <SubjectItemComponent subject={item} selectedSubject={selectedSubject} setSelectSubject={setSelectedSubject} />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader label="Student Detail" homeIcon horizontalPadding={RfW(16)} lineVisible={false} />
        <Loader isLoading={subjectLoader} />
        <StudentTopProfileComponent student={student} />
        <View
          style={{
            borderBottomColor: Colors.borderColor,
            borderTopColor: Colors.borderColor,
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            padding: RfH(16),
          }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Subjects</Text>
        </View>

        <View>
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={subjects}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(34) }}
            />
          </View>
          <View
            style={{
              borderBottomColor: Colors.borderColor,
              borderTopColor: Colors.borderColor,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
              padding: RfH(16),
            }}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Classes</Text>
          </View>
        </View>

        {selectedSubject !== null ? <StudentClassComponent student={student} subject={selectedSubject} /> : null}
      </ScrollView>
    </View>
  );
};

export default StudentDetails;
