import { View, FlatList, Text, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, ScreenHeader, Loader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Images, Colors } from '../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { tutorDetails } from '../../../apollo/cache';
import { GET_TUTOR_OFFERINGS } from '../../student/tutor-query';
import NavigationRouteNames from '../../../routes/screenNames';

function SubjectList() {
  const navigation = useNavigation();
  const [subjects, setSubjects] = useState([]);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo?.id },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const subjectList = [];
        data?.getTutorOfferings?.map((item) => {
          if (item.offering && subjectList.findIndex((obj) => obj.offering.id === item.offering.id) === -1) {
            subjectList.push(item);
          }
          setSubjects(subjectList);
        });
      }
    },
  });

  useEffect(() => {
    getTutorOffering();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTutorOffering();
    }, [])
  );

  const renderSubjects = (item) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.PRICE_MATRIX, { offering: item })}>
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(16) }]}>
          <View style={commonStyles.horizontalChildrenView}>
            <IconButtonWrapper iconImage={getSubjectIcons(item.offering.displayName)} />
            <View style={{ marginLeft: RfW(16) }}>
              <Text>
                {item?.offerings[2]?.displayName} | {item?.offerings[1]?.displayName}{' '}
              </Text>
              <Text>{item?.offerings[0]?.displayName}</Text>
            </View>
          </View>
          <IconButtonWrapper
            iconImage={Images.chevronRight}
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'flex-end' }}
          />
        </View>
        <View style={commonStyles.lineSeparatorWithMargin} />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingTutorsOffering} />
      <ScreenHeader
        label="My Subjects"
        homeIcon
        showRightIcon
        rightIcon={Images.moreInformation}
        horizontalPadding={RfW(16)}
        onRightIconClick={() => navigation.navigate(NavigationRouteNames.TUTOR.SUBJECT_SELECTION)}
      />
      <View style={commonStyles.verticallyStretchedItemsView}>
        <FlatList
          data={subjects}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderSubjects(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(84) }}
        />
      </View>
    </View>
  );
}

export default SubjectList;
