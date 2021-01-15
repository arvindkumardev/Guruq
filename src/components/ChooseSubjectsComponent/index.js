import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import { Button } from 'native-base';
import { Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { offeringsMasterData } from '../../apollo/cache';
import { STUDY_AREA_LEVELS } from '../../utils/constants';
import styles from '../../containers/student/pytn/styles';
import { GET_OFFERINGS_MASTER_DATA } from '../../containers/student/dashboard-query';
import Loader from '../Loader';

const ChooseSubjectComponent = (props) => {
  const { submitButtonText, submitButtonHandle, isMultipleSubjectSelectionAllowed } = props;
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const [selectedStudyArea, setSelectedStudyArea] = useState({});
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStudyAreaObj, setSelectedStudyAreaObj] = useState({});
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const [getOfferingMasterData, { loading: loadingOfferingMasterData }] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        offeringsMasterData(data.offerings.edges);
      }
    },
  });

  useEffect(() => {
    if (isEmpty(offeringMasterData)) {
      getOfferingMasterData();
    }
  }, [offeringMasterData]);
  const goToOtherDetails = () => {
    submitButtonHandle({
      studyArea: selectedStudyArea,
      board: selectedBoard,
      class: selectedClass,
      subject: selectedSubjects,
    });
  };

  const onSelectStudyArea = (item) => {
    setSelectedStudyArea(item);
    setSelectedStudyAreaObj(STUDY_AREA_LEVELS[item.name]);
    setSelectedSubjects([]);
    setSelectedClass({});
    setSelectedBoard({});
    setShowSubmitButton(false);
  };

  const onSelectBoard = (item) => {
    setSelectedBoard(item);
    setSelectedClass({});
    setSelectedSubjects([]);
    setShowSubmitButton(false);
  };

  const onSelectSubjects = (item) => {
    let array = [];
    if (isMultipleSubjectSelectionAllowed) {
      if (!selectedSubjects.includes(item)) {
        array = [...selectedSubjects, item];
      } else {
        selectedSubjects.forEach((obj) => {
          if (obj.id !== item.id) {
            array.push(obj);
          }
        });
      }
    } else {
      array = [item];
    }
    setSelectedSubjects(array);
    setShowSubmitButton(array.length > 0);
  };

  const onSelectGrade = (item) => {
    setSelectedClass(item);
    setSelectedSubjects([]);
    setShowSubmitButton(false);
    if (selectedStudyAreaObj.length === 3) {
      onSelectSubjects(item);
      setShowSubmitButton(true);
    }
  };

  const renderArea = (item) => (
    <TouchableOpacity
      onPress={() => (item?.id === selectedStudyArea?.id ? null : onSelectStudyArea(item))}
      style={[
        styles.itemStyle,
        {
          backgroundColor: item?.id === selectedStudyArea?.id ? Colors.lightBlue : Colors.lightGrey,
        },
      ]}
      activeOpacity={1}>
      <Text style={commonStyles.regularMutedText}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  const renderBoard = (item) => (
    <TouchableOpacity
      onPress={() => (item?.id === selectedBoard?.id ? null : onSelectBoard(item))}
      style={[
        styles.itemStyle,
        {
          backgroundColor: item?.id === selectedBoard?.id ? Colors.lightBlue : Colors.lightGrey,
        },
      ]}
      activeOpacity={1}>
      <Text style={commonStyles.regularMutedText}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  const renderStudyArea = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>Area of Study</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {offeringMasterData && offeringMasterData.filter((s) => s.level === 0).map((item) => renderArea(item))}
      </View>
    </View>
  );

  const renderBoards = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>{selectedStudyAreaObj.find((item) => item.level === 1).label}</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {selectedStudyArea &&
          offeringMasterData &&
          offeringMasterData
            .filter((s) => s?.parentOffering?.id === selectedStudyArea?.id)
            .map((item) => renderBoard(item))}
      </View>
    </View>
  );

  const renderClass = (item) => (
    <TouchableOpacity
      onPress={() => (item?.id === selectedClass?.id ? null : onSelectGrade(item))}
      style={[
        styles.itemStyle,
        {
          backgroundColor: item?.id === selectedClass?.id ? Colors.lightBlue : Colors.lightGrey,
        },
      ]}
      activeOpacity={1}>
      <Text style={[commonStyles.regularMutedText, { textAlign: 'center' }]}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  const renderSubject = (item) => (
    <TouchableOpacity
      onPress={() => onSelectSubjects(item)}
      style={[
        styles.itemStyle,
        {
          backgroundColor: selectedSubjects.some((s) => s.id === item.id) ? Colors.lightBlue : Colors.lightGrey,
        },
      ]}
      activeOpacity={1}>
      <Text style={[commonStyles.regularMutedText, { textAlign: 'center' }]}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  const renderClasses = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>{selectedStudyAreaObj.find((item) => item.level === 2).label}</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {selectedBoard &&
          offeringMasterData.filter((s) => s?.parentOffering?.id === selectedBoard?.id).map((sub) => renderClass(sub))}
      </View>
    </View>
  );

  const renderSubjects = () => (
    <View>
      <Text style={commonStyles.headingPrimaryText}>{selectedStudyAreaObj.find((item) => item.level === 3).label}</Text>
      <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {offeringMasterData.filter((s) => s?.parentOffering?.id === selectedClass?.id).map((sub) => renderSubject(sub))}
      </View>
    </View>
  );

  return (
    <>
      <Loader isLoading={loadingOfferingMasterData} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: RfH(16) }}>
        <View style={{ height: RfH(44) }} />
        <View style={{ marginHorizontal: RfW(16) }}>
          {renderStudyArea()}
          <View style={{ height: RfH(32) }} />
          {!isEmpty(selectedStudyArea) && !isEmpty(selectedStudyAreaObj) && renderBoards()}
          <View style={{ height: RfH(32) }} />
          {!isEmpty(selectedBoard) && !isEmpty(selectedStudyAreaObj) && renderClasses()}
          <View style={{ height: RfH(32) }} />
          {!isEmpty(selectedClass) && selectedStudyAreaObj.length > 3 && renderSubjects()}
        </View>
      </ScrollView>
      {showSubmitButton && (
        <Button
          onPress={goToOtherDetails}
          block
          style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
          <Text style={commonStyles.textButtonPrimary}>{submitButtonText}</Text>
        </Button>
      )}
    </>
  );
};

ChooseSubjectComponent.defaultProps = {
  submitButtonText: 'Submit',
  isMultipleSubjectSelectionAllowed: false,
  submitButtonHandle: null,
};

ChooseSubjectComponent.propTypes = {
  submitButtonText: PropTypes.string,
  isMultipleSubjectSelectionAllowed: PropTypes.bool,
  submitButtonHandle: PropTypes.func,
};

export default ChooseSubjectComponent;
