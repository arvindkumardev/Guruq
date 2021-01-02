import { View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { Colors } from '../../../theme';
import { alertBox, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { ChooseSubjectComponent, ScreenHeader, Loader } from '../../../components';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../tutor.mutation';
import { MARK_CERTIFIED } from '../../certficationProcess/certification-mutation';
import NavigationRouteNames from '../../../routes/screenNames';

function SubjectSelection(props) {
  const navigation = useNavigation();
  const isOnBoarding = props?.route?.params?.isOnBoarding;

  const [markCertified, { loading: markTutorCertifiedLoading }] = useMutation(MARK_CERTIFIED, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(NavigationRouteNames.TUTOR.CERTIFICATION_COMPLETED_VIEW);
      }
    },
  });

  const [createTutorOffering, { loading: createTutorOfferingLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        alertBox('Selected subject already present in your list!', '', {
          positiveText: 'Go back',
          onPositiveClick: () => navigation.goBack(),
          negativeText: 'Cancel',
        });
      }
    },
    onCompleted: (data) => {
      if (data) {
        if (isOnBoarding) {
          markCertified();
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      }
    },
  });

  const submitOffering = (subjectData) => {
    createTutorOffering({
      variables: {
        tutorOfferingDto: {
          offering: { id: subjectData?.subject[0]?.id },
        },
      },
    });
  };

  return (
    <>
      <Loader isLoading={createTutorOfferingLoading || markTutorCertifiedLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Select Subject" horizontalPadding={RfW(16)} />
        <ChooseSubjectComponent
          isMultipleSubjectSelectionAllowed={false}
          submitButtonHandle={submitOffering}
          submitButtonText="Submit"
        />
      </View>
    </>
  );
}

export default SubjectSelection;
