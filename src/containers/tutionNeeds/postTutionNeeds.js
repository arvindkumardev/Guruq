import { FlatList, ScrollView, Text, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Colors } from '../../theme';
import { deviceWidth, RfH, RfW } from '../../utils/helpers';
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

  const goToOtherDetails = () => {
    navigation.navigate(routeNames.POST_TUTION_NEED_DETAILS, {
      subjectData: {
        studyArea: selectedStudyArea,
        board: selectedBoard,
        class: selectedClass,
        subject: selectedSubjects,
      },
    });
  };

  const renderArea = (item) => (
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

  const renderBoard = (item) => (
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

  const renderStudyArea = () => (
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

  const renderBoards = () => (
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

  const renderSubject = (item) => (
    <TouchableOpacity onPress={() => selectSubjects(item)}>
      <View
        style={[
          styles.itemStyle,
          {
            backgroundColor: selectedSubjects.some((s) => s.id === item.id) ? Colors.lightBlue : Colors.lightGrey,
          },
        ]}>
        <Text style={[commonStyles.regularMutedText, { textAlign: 'center' }]}>{item.displayName}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderClasses = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>Class</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {selectedBoard &&
          offeringMasterData.filter((s) => s?.parentOffering?.id === selectedBoard?.id).map((sub) => renderClass(sub))}
      </View>
    </View>
  );

  const renderSubjects = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>Subjects</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {offeringMasterData.filter((s) => s?.parentOffering?.id === selectedClass?.id).map((sub) => renderSubject(sub))}
      </View>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Post your tution needs" horizontalPadding={RfW(16)} />
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
      {selectedSubjects.length > 0 && (
        <Button
          onPress={() => goToOtherDetails()}
          block
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
          <Text style={commonStyles.textButtonPrimary}>Next</Text>
        </Button>
      )}
    </View>
  );
}

export default PostTutionNeeds;
