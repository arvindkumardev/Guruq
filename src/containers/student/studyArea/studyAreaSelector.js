/* eslint-disable no-nested-ternary */
import { FlatList, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import routeNames from '../../../routes/screenNames';
import { userDetails } from '../../../apollo/cache';
import { GET_OFFERINGS_MASTER_DATA } from '../dashboard-query';
import { IconButtonWrapper } from '../../../components';
import BackArrow from '../../../components/BackArrow';

function StudyAreaSelector() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);

  const { loading, error, data } = useQuery(GET_OFFERINGS_MASTER_DATA);

  // useEffect(()=>{
  //
  //   data.map();
  // },[data]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClick = (s) => {
    navigation.navigate(routeNames.STUDENT.BOARD, { studyArea: s });
  };

  const renderItem = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => onClick(item)}>
        <View
          style={[
            styles.areaView,
            {
              marginHorizontal: RfW(8),
              marginVertical: RfW(16),
              backgroundColor:
                index === 0
                  ? Colors.lightOrange
                  : index === 1
                  ? Colors.lightGreen
                  : index === 2
                  ? Colors.lightPurple
                  : Colors.lightBlue,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View style={{ alignItems: 'center' }}>
            <IconButtonWrapper
              iconImage={
                index === 0
                  ? Images.school_education
                  : index === 1
                  ? Images.language
                  : index === 2
                  ? Images.abroad
                  : Images.pen_paper
              }
            />
            <Text style={styles.areaTitleOne}>{item.displayName}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: '#fff' }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.helloView}>
        <BackArrow action={onBackPress} />
        {/* <Text style={styles.helloText}>Hello</Text> */}
      </View>
      {/* <Text style={styles.userName}>{userInfo?.firstName}</Text> */}
      <Text style={styles.subHeading}>Select Your Study Area</Text>
      <Text style={styles.subHeadingText}>To help us find the best tutors for you</Text>

      <View style={styles.areaParentView}>
        <FlatList
          data={data && data.offerings && data.offerings.edges && data.offerings.edges.filter((s) => s.level === 0)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        {/* {data &&
          data.offerings &&
          data.offerings.edges &&
          data.offerings.edges
            .filter((s) => s.level === 0)
            .map((s) => {
              return (
                <TouchableWithoutFeedback onPress={() => onClick(s)}>
                  <View
                    style={[
                      styles.areaView,
                      {
                        marginHorizontal: RfW(4),
                        backgroundColor: Colors.lightOrange,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <View style={{ alignItems: 'center' }}>
                      <Thumbnail square source={Images.civic} />
                      <Text style={styles.areaTitleOne}>{s.displayName}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })} */}

        {/* <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}> */}
        {/*  <View style={[styles.areaView, { backgroundColor: 'rgb(230,252,231)', marginLeft: RfW(8) }]}> */}
        {/*    <View style={{ alignItems: 'center' }}> */}
        {/*      <Thumbnail square source={Images.civic} /> */}
        {/*      <Text style={styles.areaTitleOne}>Competitive</Text> */}
        {/*      <Text style={styles.areaTitleTwo}>Exams</Text> */}
        {/*    </View> */}
        {/*  </View> */}
        {/* </TouchableWithoutFeedback> */}
      </View>
      {/* <View style={styles.areaParentView}> */}
      {/*  <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}> */}
      {/*    <View style={[styles.areaView, { backgroundColor: 'rgb(231,229,242)', marginRight: RfW(8) }]}> */}
      {/*      <View style={{ alignItems: 'center' }}> */}
      {/*        <Thumbnail square source={Images.civic} /> */}
      {/*        <Text style={styles.areaTitleOne}>Study</Text> */}
      {/*        <Text style={styles.areaTitleTwo}>Abroad</Text> */}
      {/*      </View> */}
      {/*    </View> */}
      {/*  </TouchableWithoutFeedback> */}
      {/*  <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}> */}
      {/*    <View style={[styles.areaView, { backgroundColor: 'rgb(203,231,255)', marginLeft: RfW(8) }]}> */}
      {/*      <View style={{ alignItems: 'center' }}> */}
      {/*        <Thumbnail square source={Images.civic} /> */}
      {/*        <Text style={styles.areaTitleOne}>Language</Text> */}
      {/*        <Text style={styles.areaTitleTwo}>Learning</Text> */}
      {/*      </View> */}
      {/*    </View> */}
      {/*  </TouchableWithoutFeedback> */}
      {/* </View> */}
    </View>
  );
}

export default StudyAreaSelector;
