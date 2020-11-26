/* eslint-disable no-nested-ternary */
import { FlatList, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import NavigationRouteNames from '../../../routes/screenNames';
import { ADD_INTERESTED_OFFERINGS } from '../dashboard-mutation';
import { offeringsMasterData } from '../../../apollo/cache';
import Fonts from '../../../theme/fonts';
import BackArrow from '../../../components/BackArrow';

function ClassSelector(props) {
  const navigation = useNavigation();

  const { route } = props;
  const { board } = route.params;

  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const [addInterestedOffering, { loading: addOfferingLoading }] = useMutation(ADD_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',

    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD, { refetchStudentOfferings: true });
      }
    },
    onCompleted: (data) => {
      if (data) {
        navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD, { refetchStudentOfferings: true });
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
              // height: RfH(54),
              marginHorizontal: RfW(8),
              marginVertical: RfW(8),
              height: RfH(100),
              width: RfW(100),
              backgroundColor:
                // Colors.lightGrey,
                index % 4 === 0
                  ? Colors.lightOrange
                  : index % 4 === 1
                  ? Colors.lightGreen
                  : index % 4 === 2
                  ? Colors.lightPurple
                  : Colors.lightBlue,
              // flex: 0,
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
    <View style={[commonStyles.mainContainer, { backgroundColor: '#fff' }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.helloView]}>
        <BackArrow action={onBackPress} />
        <Text
          style={{
            fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
            fontFamily: Fonts.semiBold,
            color: Colors.primaryText,
            marginLeft: RfH(16),
            alignSelf: 'center',
          }}>
          Select Your Level
        </Text>
      </View>
      <View style={[commonStyles.areaParentView, { paddingTop: RfH(44), marginBottom: RfH(98) }]}>
        <FlatList
          data={offeringMasterData && offeringMasterData.filter((s) => s?.parentOffering?.id === board.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        {/* {data &&
          data.offerings &&
          data.offerings.edges &&
          data.offerings.edges
            .filter((s) => s?.parentOffering?.id === board.id)
            .map((s) => {
              return (
                <TouchableWithoutFeedback onPress={() => onClick(s)} style={{ alignItems: 'center', flex: 1 }}>
                  <View style={[styles.classView, { marginRight: RfW(8) }]}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.classTitle}>{s.displayName}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })} */}
      </View>

      {/* <View style={[styles.areaParentView, { marginTop: RfH(56) }]}> */}
      {/*  {renderClassView(1, 'rgb(203,231,255)')} */}
      {/*  {renderClassView(2, 'rgb(230,252,231)')} */}
      {/*  {renderClassView(3, 'rgb(231,229,242)')} */}
      {/* </View> */}
      {/* <View style={[styles.areaParentView, { marginTop: RfH(24) }]}> */}
      {/*  {renderClassView(4, 'rgb(230,252,231)')} */}
      {/*  {renderClassView(5, 'rgb(203,231,255)')} */}
      {/*  {renderClassView(6, 'rgb(255,247,240)')} */}
      {/* </View> */}
      {/* <View style={[styles.areaParentView, { marginTop: RfH(24) }]}> */}
      {/*  {renderClassView(7, 'rgb(231,229,242)')} */}
      {/*  {renderClassView(8, 'rgb(255,247,240)')} */}
      {/*  {renderClassView(9, 'rgb(203,231,255)')} */}
      {/* </View> */}
      {/* <View style={[styles.areaParentView, { marginTop: RfH(24) }]}> */}
      {/*  {renderClassView(10, 'rgb(203,231,255)')} */}
      {/*  {renderClassView(11, 'rgb(231,229,242)')} */}
      {/*  {renderClassView(12, 'rgb(230,252,231)')} */}
      {/* </View> */}
    </View>
  );
}

export default ClassSelector;
