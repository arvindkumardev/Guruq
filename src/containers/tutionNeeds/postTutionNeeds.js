import { Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { ScreenHeader } from '../../components';
import { offeringsMasterData } from '../../apollo/cache';
import routeNames from '../../routes/screenNames';

function PostTutionNeeds() {
  const navigation = useNavigation();
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [selectedStudyArea, setSelectedStudyArea] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const renderArea = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedStudyArea(item)}>
        <View
          style={[
            styles.itemStyle,
            {
              backgroundColor: item?.id === selectedStudyArea?.id ? Colors.lightBlue : Colors.lightGrey,
            },
          ]}>
          <Text style={commonStyles.regularMutedText}>{item.displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderBoard = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedBoard(item)}>
        <View
          style={[
            styles.itemStyle,
            {
              backgroundColor: item?.id === selectedBoard?.id ? Colors.lightBlue : Colors.lightGrey,
            },
          ]}>
          <Text style={commonStyles.regularMutedText}>{item.displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderStudyArea = () => {
    return (
      <View>
        <Text style={commonStyles.headingPrimaryText}>Area of Study</Text>
        <FlatList
          horizontal
          data={offeringMasterData && offeringMasterData.filter((s) => s.level === 0)}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: RfH(24) }}
          renderItem={({ item }) => renderArea(item, 1)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const renderBoards = () => {
    return (
      <View>
        <Text style={commonStyles.headingPrimaryText}>Board</Text>
        <FlatList
          horizontal
          data={
            selectedStudyArea &&
            offeringMasterData &&
            offeringMasterData.filter((s) => s?.parentOffering?.id === selectedStudyArea?.id)
          }
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: RfH(24) }}
          renderItem={({ item }) => renderBoard(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const renderClass = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedClass(item)}>
        <View
          style={[
            styles.itemStyle,
            {
              backgroundColor: item?.id === selectedClass?.id ? Colors.lightBlue : Colors.lightGrey,
            },
          ]}>
          <Text style={[commonStyles.regularMutedText, { textAlign: 'center' }]}>{item.displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const selectSubjects = (item) => {
    const array = [];
    selectedSubjects.map((obj) => {
      array.push(obj);
    });
    array.push(item);
    setSelectedSubjects(array);
  };

  const renderSubject = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => selectSubjects(item)}>
        <View
          style={[
            styles.itemStyle,
            {
              backgroundColor: selectedSubjects.some((s) => s.id === item.id) ? Colors.lightBlue : Colors.lightGrey,
            },
          ]}>
          <Text style={[commonStyles.regularMutedText, { textAlign: 'center' }]}>{item.displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderClasses = () => {
    return (
      <View>
        <Text style={commonStyles.headingPrimaryText}>Class</Text>
        <FlatList
          data={selectedBoard && offeringMasterData.filter((s) => s?.parentOffering?.id === selectedBoard?.id)}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: RfH(24) }}
          numColumns={4}
          renderItem={({ item }) => renderClass(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const renderSubjects = () => {
    return (
      <View>
        <Text style={commonStyles.headingPrimaryText}>Subjects</Text>
        <FlatList
          data={offeringMasterData.filter((s) => s?.parentOffering?.id === selectedClass?.id)}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: RfH(24) }}
          numColumns={4}
          renderItem={({ item }) => renderSubject(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Post your tution needs"
        showRightIcon
        rightIcon={Images.moreInformation}
        horizontalPadding={RfW(16)}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RfH(16) }}>
        <View style={{ height: RfH(44) }} />
        <View style={{ marginHorizontal: RfW(16) }}>
          {renderStudyArea()}
          <View style={{ height: RfH(32) }} />
          {selectedStudyArea && renderBoards()}
          <View style={{ height: RfH(32) }} />
          {selectedBoard && renderClasses()}
          <View style={{ height: RfH(32) }} />
          {selectedClass && renderSubjects()}
        </View>
      </ScrollView>
      <Button
        onPress={() => navigation.navigate(routeNames.POST_TUTION_NEED_DETAILS)}
        block
        style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </Button>
    </View>
  );
}

export default PostTutionNeeds;
