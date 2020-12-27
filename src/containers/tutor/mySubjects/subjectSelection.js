import { View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../theme';
import { RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { ChooseSubjectComponent, ScreenHeader } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';

function SubjectSelection() {
  const navigation = useNavigation();

  const goToOtherDetails = (subjectData) => {
    navigation.navigate(NavigationRouteNames.POST_TUTION_NEED_DETAILS, { subjectData });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Post your tution needs" horizontalPadding={RfW(16)} />
      <ChooseSubjectComponent
        isMultipleSubjectSelectionAllowed
        submitButtonHandle={goToOtherDetails}
        submitButtonText="Next"
      />
    </View>
  );
}

export default SubjectSelection;
