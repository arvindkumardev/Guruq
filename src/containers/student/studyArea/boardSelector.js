/* eslint-disable no-nested-ternary */
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { interestingOfferingData, offeringsMasterData } from '../../../apollo/cache';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import BackArrow from '../../../components/BackArrow';
import routeNames from '../../../routes/screenNames';
import NavigationRouteNames from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import Fonts from '../../../theme/fonts';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE, STUDY_AREA_LEVELS } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import { GET_INTERESTED_OFFERINGS } from '../dashboard-query';
import { ADD_INTERESTED_OFFERINGS } from '../dashboard-mutation';
import Loader from '../../../components/Loader';

const BACKGROUND_COLOR = [Colors.lightOrange, Colors.lightGreen, Colors.lightPurple, Colors.lightBlue];
function BoardSelector(props) {
  const navigation = useNavigation();

  const { route } = props;
  const { studyArea } = route.params;
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const studyAreaObj = STUDY_AREA_LEVELS[studyArea.name];
  const listData = offeringMasterData && offeringMasterData.filter((s) => s?.parentOffering?.id === studyArea.id);

  const onBackPress = () => {
    navigation.goBack();
  };

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

  const onClick = (item) => {
    if (studyAreaObj.length === 3) {
      addInterestedOffering({
        variables: { offeringId: item.id },
      });
    } else {
      navigation.navigate(routeNames.STUDENT.CLASS, { board: item, studyArea });
    }
  };

  const slugify = (name) => {
    return name
      ? name
          .split(' ')
          .filter((s) => s.trim().length > 0)
          .join('_')
          .toLowerCase()
      : '';
  };

  const renderItem = (item, index) => (
    <TouchableWithoutFeedback onPress={() => onClick(item)}>
      <View
        style={[
          styles.areaView,
          {
            marginHorizontal: RfW(8),
            marginVertical: RfW(16),
            backgroundColor: BACKGROUND_COLOR[index % 4],
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={{ alignItems: 'center' }}>
          <IconButtonWrapper
            iconWidth={RfH(64)}
            iconHeight={RfH(64)}
            iconImage={Images[slugify(item.name)]}
            imageResizeMode="contain"
          />
          <Text style={styles.areaTitleOne}>{item.displayName}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <Loader isLoading={interestedOfferingsLoading || addOfferingLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: '#fff' }]}>
        <ScreenHeader label={`Select Your ${studyAreaObj.find((item) => item.level === 1)?.label}`} homeIcon />
        <View style={styles.areaParentView}>
          <FlatList
            data={listData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            scrollEnabled={listData.length > 5}
            ListFooterComponent={<View style={{ height: RfH(100) }} />}
          />
        </View>
      </View>
    </>
  );
}

export default BoardSelector;
