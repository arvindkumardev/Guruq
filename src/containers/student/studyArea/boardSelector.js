/* eslint-disable no-nested-ternary */
import { StatusBar, Text, TouchableWithoutFeedback, View, FlatList } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { IconButtonWrapper } from '../../../components';
import styles from './style';
import routeNames from '../../../routes/screenNames';
import { GET_OFFERINGS_MASTER_DATA } from '../dashboard-query';

function BoardSelector(props) {
  const navigation = useNavigation();

  const { route } = props;
  const { studyArea } = route.params;

  const { loading, error, data } = useQuery(GET_OFFERINGS_MASTER_DATA);

  const onClick = (s) => {
    navigation.navigate(routeNames.STUDENT.CLASS, { board: s });
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
              iconHeight={RfH(70)}
              iconImage={index === 0 ? Images.igcse : index === 1 ? Images.ib : index === 2 ? Images.icse : Images.cbse}
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
        <Icon
          onPress={() => onBackPress()}
          type="MaterialIcons"
          name="keyboard-backspace"
          style={{ color: Colors.primaryText }}
        />
        <Text
          style={{
            fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
            fontFamily: 'SegoeUI-Bold',
            color: Colors.primaryText,
            marginLeft: RfH(20),
            alignSelf: 'center',
          }}>
          Select your Board
        </Text>
      </View>
      <View style={styles.areaParentView}>
        <FlatList
          data={
            data &&
            data.offerings &&
            data.offerings.edges &&
            data.offerings.edges.filter((s) => s?.parentOffering?.id === studyArea.id)
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        {/* {data &&
          data.offerings &&
          data.offerings.edges &&
          data.offerings.edges
            .filter((s) => s?.parentOffering?.id === studyArea.id)
            .map((s) => {
              return (
                <TouchableWithoutFeedback onPress={() => onClick(s)} style={{ alignItems: 'center', flex: 1 }}>
                  <View style={[styles.areaView, { backgroundColor: 'rgb(255,247,240)', marginHorizontal: RfW(4) }]}>
                    <View style={{ alignItems: 'center' }}>
                      <Thumbnail style={{ height: RfH(70) }} square source={Images.cbse} />
                      <Text style={styles.areaTitleOne}>{s.displayName}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })} */}
        {/* <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}> */}
        {/*  <View style={[styles.areaView, { backgroundColor: 'rgb(230,252,231)', marginLeft: RfW(8) }]}> */}
        {/*    <View style={{ alignItems: 'center' }}> */}
        {/*      <Thumbnail style={{ height: RfH(70) }} square source={Images.icse} /> */}
        {/*      <Text style={styles.areaTitleOne}>ICSE</Text> */}
        {/*    </View> */}
        {/*  </View> */}
        {/* </TouchableWithoutFeedback> */}
      </View>
      {/* <View style={styles.areaParentView}> */}
      {/*  <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}> */}
      {/*    <View style={[styles.areaView, { backgroundColor: 'rgb(231,229,242)', marginRight: RfW(8) }]}> */}
      {/*      <View style={{ alignItems: 'center' }}> */}
      {/*        <Thumbnail style={{ height: RfH(70) }} square source={Images.ib} /> */}
      {/*        <Text style={styles.areaTitleOne}>IB</Text> */}
      {/*      </View> */}
      {/*    </View> */}
      {/*  </TouchableWithoutFeedback> */}
      {/*  <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}> */}
      {/*    <View style={[styles.areaView, { backgroundColor: 'rgb(203,231,255)', marginLeft: RfW(8) }]}> */}
      {/*      <View style={{ alignItems: 'center' }}> */}
      {/*        <Thumbnail style={{ height: RfH(70) }} square source={Images.igcse} /> */}
      {/*        <Text style={styles.areaTitleOne}>IGCSE</Text> */}
      {/*      </View> */}
      {/*    </View> */}
      {/*  </TouchableWithoutFeedback> */}
      {/* </View> */}
    </View>
  );
}

export default BoardSelector;
