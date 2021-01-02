import { View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../theme';
import { RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { ChooseSubjectComponent, ScreenHeader } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';

function PytnSubjectSelection() {
  const navigation = useNavigation();

  const goToOtherDetails = (subjectData) => {
    navigation.navigate(NavigationRouteNames.PYTN_DETAILS, { subjectData });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Post Your Tuition Needs" horizontalPadding={RfW(16)} />
      <ChooseSubjectComponent
        isMultipleSubjectSelectionAllowed
        submitButtonHandle={goToOtherDetails}
        submitButtonText="Next"
      />
    </View>
  );
}

export default PytnSubjectSelection;
