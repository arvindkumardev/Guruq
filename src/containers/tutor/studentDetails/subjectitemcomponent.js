import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import IconButtonWrapper from '../../../components/IconWrapper';
import commonStyles from '../../../theme/styles';
const SubjectItemComponent = ({ subject, selectedSubject, setSelectSubject }) => {
  function setIconImage() {
    if (selectedSubject != null) {
      return getSubjectIcons(subject.displayName, selectedSubject.id !== subject.id);
    }
    return getSubjectIcons(subject.displayName, false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => setSelectSubject(subject)}>
      <View style={styles.mainContainer}>
        <View style={styles.iconContainer}>
          <IconButtonWrapper
            iconWidth={RfW(64)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(64)}
            iconImage={setIconImage()}
          />
        </View>
        <Text style={styles.subjectText}>{subject.displayName}</Text>
        <Text style={commonStyles.smallMutedText}>
          {subject.parentOffering.displayName}|{subject.parentOffering.parentOffering.displayName}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(SubjectItemComponent);
