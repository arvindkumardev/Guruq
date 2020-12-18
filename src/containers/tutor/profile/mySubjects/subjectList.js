import { View, FlatList, Text, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Images, Colors } from '../../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../../utils/helpers';
import { tutorDetails } from '../../../../apollo/cache';
import { GET_TUTOR_OFFERINGS } from '../../../student/tutor-query';
import routeNames from '../../../../routes/screenNames';
import Loader from '../../../../components/Loader';

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
        data?.getTutorOfferings?.map((item) => {
          if (item.offering && subjects.findIndex((obj) => obj.offering.id === item.offering.id) === -1) {
            subjects.push(item);
          }
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

  const renderSubjects = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.TUTOR.PRICE_MATRIX)}>
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
  };
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Loader isLoading={loadingTutorsOffering} />
      <ScreenHeader
        label="My Subjects"
        homeIcon
        showRightIcon
        rightIcon={Images.moreInformation}
        horizontalPadding={RfW(16)}
        onRightIconClick={() => navigation.navigate(routeNames.POST_TUTION_NEEDS)}
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
