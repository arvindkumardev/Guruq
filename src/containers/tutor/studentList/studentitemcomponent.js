import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles';
import StudentImageComponent from '../../../components/StudentImageComponent';
import { RfH } from '../../../utils/helpers';

const StudentItemComponent = ({ student, navigation, routeNames }) => {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.TUTOR.STUDENT_DETAILS, { student })}>
      <View>
        <View style={styles.mainContainer}>
          <StudentImageComponent student={student} width={64} height={64} styling={{ borderRadius: RfH(8) }} />
          <View style={styles.childContainer}>
            <Text style={styles.nameTextStyle}>
              {student.contactDetail.firstName} {student.contactDetail.lastName}
            </Text>
            <Text style={styles.idTextStyle}>GURUQS-{student.id}</Text>
          </View>
        </View>
        <View style={styles.bottomBarView} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(StudentItemComponent);
