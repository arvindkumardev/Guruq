/* eslint-disable no-nested-ternary */
import { FlatList, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import routeNames from '../../../routes/screenNames';
import { offeringsMasterData } from '../../../apollo/cache';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import BackArrow from '../../../components/BackArrow';
import {
  COMPETITIVE_EXAM,
  LANGUAGE_LEARNING,
  SCHOOL_EDUCATION,
  STANDARD_SCREEN_SIZE,
  STUDY_ABROAD,
} from '../../../utils/constants';
import Fonts from '../../../theme/fonts';

const BACKGROUND_COLOR = [Colors.lightOrange, Colors.lightGreen, Colors.lightPurple, Colors.lightBlue];

function StudyAreaSelector() {
  const navigation = useNavigation();
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClick = (studyArea) => {
    navigation.navigate(routeNames.STUDENT.BOARD, { studyArea });
  };

  // eslint-disable-next-line consistent-return
  const getStudyAreaIcon = (name) => {
    switch (name) {
      case STUDY_ABROAD:
        return Images.abroad;
      case SCHOOL_EDUCATION:
        return Images.school;
      case LANGUAGE_LEARNING:
        return Images.language;
      case COMPETITIVE_EXAM:
        return Images.pen_paper;
    }
  };

  const renderItem = (item, index) => (
    <TouchableWithoutFeedback onPress={() => onClick(item)}>
      <View
        style={[
          styles.areaView,
          {
            marginHorizontal: RfW(8),
            marginVertical: RfW(16),
            backgroundColor: BACKGROUND_COLOR[index],
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={{ alignItems: 'center' }}>
          <IconButtonWrapper iconImage={getStudyAreaIcon(item.name)} imageResizeMode="contain" />
          <Text style={styles.areaTitleOne}>{item.displayName}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: '#fff', paddingHorizontal: 0 }]}>
      <ScreenHeader label="Select Your Study Area" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <Text style={styles.subHeading}>Select Your Study Area</Text>
        <Text style={styles.subHeadingText}>This will help us find the best tutors for you</Text>
        <View style={[styles.areaParentView, { marginTop: RfH(50) }]}>
          <FlatList
            data={offeringMasterData && offeringMasterData.filter((s) => s.level === 0)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
      </View>
    </View>
  );
}

export default StudyAreaSelector;
