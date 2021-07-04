import React from 'react';
import { View, Text } from 'react-native';
import StudentImageComponent from '../StudentImageComponent';
import { styles } from './styles';
import { RfH, RfW, getFullName } from '../../utils/helpers';

const StudentTopProfileComponent = ({ student }) => {
  
  return (
    <View style={styles.topContainer}>
      <StudentImageComponent
        student={student}
        styling={{ alignSelf: 'center', borderRadius: RfH(15), height: RfH(80), width: RfH(80) }}
      />
      <View style={{ marginLeft: RfW(16), width: '70%' }}>
        <Text style={styles.studentName}>{getFullName(student?.contactDetail)}</Text>
        <Text style={styles.studentDetails}>GURUQS-{student?.id}</Text>
      </View>
    </View>
  );
};

export default React.memo(StudentTopProfileComponent);
