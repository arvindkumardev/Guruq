import { FlatList, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { STANDARD_SCREEN_SIZE, STUDY_AREA_LEVELS } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import NavigationRouteNames from '../../../routes/screenNames';
import { ADD_INTERESTED_OFFERINGS } from '../dashboard-mutation';
import { interestingOfferingData, offeringsMasterData } from '../../../apollo/cache';
import Fonts from '../../../theme/fonts';
import BackArrow from '../../../components/BackArrow';
import { GET_INTERESTED_OFFERINGS } from '../dashboard-query';
import Loader from '../../../components/Loader';
import { ScreenHeader } from '../../../components';

const BACKGROUND_COLOR = [Colors.lightOrange, Colors.lightGreen, Colors.lightPurple, Colors.lightBlue];
function ClassSelector(props) {
  const navigation = useNavigation();
  const { route } = props;
  const { board, studyArea } = route.params;

  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studyAreaObj = STUDY_AREA_LEVELS[studyArea.name];
  const listData = offeringMasterData && offeringMasterData.filter((s) => s?.parentOffering?.id === board.id);

  const [getInterestedOfferings, { loading: interestedOfferingsLoading }] = useLazyQuery(GET_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
    onCompleted: (data) => {
      if (data && data.getInterestedOfferings && data.getInterestedOfferings.length > 0) {
        interestingOfferingData(data.getInterestedOfferings);
        navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD, { refetchStudentOfferings: true });
      }
    },
  });

  const [addInterestedOffering, { loading: addOfferingLoading }] = useMutation(ADD_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD, { refetchStudentOfferings: true });
      }
    },
    onCompleted: (data) => {
      if (data) {
        getInterestedOfferings();
      }
    },
  });

  const onClick = (s) => {
    addInterestedOffering({
      variables: { offeringId: s.id },
    });
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderItem = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => onClick(item)}>
        <View
          style={[
            styles.areaView,
            {
              marginHorizontal: RfW(8),
              marginVertical: RfW(8),
              height: RfH(100),
              width: RfW(100),
              backgroundColor: BACKGROUND_COLOR[index % 4],
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[
                styles.areaTitleOne,
                {
                  marginTop: RfH(0),
                  fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
                },
              ]}>
              {item.displayName}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <Loader isLoading={interestedOfferingsLoading || addOfferingLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: '#fff', paddingHorizontal: 0 }]}>
        <ScreenHeader
          label={`Select Your ${studyAreaObj.find((item) => item.level === 2)?.label}`}
          homeIcon
          horizontalPadding={RfW(16)}
        />
        <View style={[commonStyles.areaParentView, { paddingTop: RfH(24), paddingHorizontal: RfW(16) }]}>
          <FlatList
            data={listData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={listData.length > 5}
            numColumns={2}
            ListFooterComponent={<View style={{ height: RfH(100) }} />}
          />
        </View>
      </View>
    </>
  );
}

export default ClassSelector;
