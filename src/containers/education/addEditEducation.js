import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty, omit } from 'lodash';
import {
  CustomCheckBox,
  CustomRadioButton,
  CustomSelect,
  IconButtonWrapper,
  Loader,
  ScreenHeader,
} from '../../components';
import { offeringsMasterData, studentDetails, tutorDetails, userType } from '../../apollo/cache';
import commonStyles from '../../theme/styles';
import { Colors, Images } from '../../theme';
import { alertBox, RfH, RfW, startOfDay } from '../../utils/helpers';
import CustomDatePicker from '../../components/CustomDatePicker';
import { ADD_UPDATE_EDUCATION_DETAILS } from './education.mutation';
import { SCHOOL_EDUCATION } from '../../utils/constants';
import { HighSchoolStreamEnum } from '../common/enums';
import { UserTypeEnum } from '../../common/userType.enum';
import { GET_DEGREE_LIST } from './education.query';
import DegreeModal from './degreeSelectionModal';

const highSchoolStreams = [];
Object.keys(HighSchoolStreamEnum).forEach(function (key) {
  highSchoolStreams.push({ value: HighSchoolStreamEnum[key].label, label: key });
});

function AddEditEducation(props) {
  const navigation = useNavigation();
  const educationDetail = props.route.params.detail;
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const studentInfo = useReactiveVar(studentDetails);
  const tutorInfo = useReactiveVar(tutorDetails);
  const [eduId, setEduId] = useState('');
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const schoolEducation = offeringMasterData.find((s) => s.level === 0 && s.name === SCHOOL_EDUCATION);
  const boards = offeringMasterData.filter((s) => s?.parentOffering?.id === schoolEducation?.id);

  const [schoolName, setSchoolName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState({});
  const [selectedDegree, setSelectedDegree] = useState({});
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedStream, setSelectedStream] = useState({});
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [educationType, setEducationType] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [degree, setDegree] = useState([]);
  const [showDegrees, setShowDegrees] = useState(false);

  useEffect(() => {
    if (!isEmpty(educationDetail) && !isEmpty(degree)) {
      setSchoolName(educationDetail.school.name);
      setStartDate(educationDetail.startDate);
      setEndDate(educationDetail.endDate);
      setIsCurrent(educationDetail.isCurrent);
      setEducationType(educationDetail.degree ? 1 : 0);
      setFieldOfStudy(educationDetail.fieldOfStudy);
      setEduId(educationDetail?.id);
      setSelectedDegree(degree.find((item) => item.id === educationDetail?.degree?.id));
      if (educationDetail?.board) {
        setSelectedBoard(boards.find((item) => item.displayName === educationDetail?.board.toUpperCase()));
        const board = boards.find((item) => item.displayName === educationDetail?.board.toUpperCase());
        if (board) {
          const classes = offeringMasterData.filter((item) => item?.parentOffering?.id === board?.id);
          setSelectedClass(classes.find((item) => item.name === educationDetail?.grade));
        }
        if (educationDetail.fieldOfStudy) {
          setSelectedStream(
            highSchoolStreams.find((item) => item.value.toUpperCase() === educationDetail?.fieldOfStudy.toUpperCase())
          );
        }
      }
    }
  }, [educationDetail, degree]);

  const [saveEducation, { loading: educationLoading }] = useMutation(ADD_UPDATE_EDUCATION_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Education details saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const [getDegreeData, { loading: degreeDataLoading }] = useLazyQuery(GET_DEGREE_LIST, {
    fetchPolicy: 'no-cache',
    variables: { limit: 200 },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setDegree(data?.getDegrees?.edges);
      }
    },
  });

  const checkValues = () => {
    if (isEmpty(schoolName)) {
      alertBox('Please provide the school/institute name');
    } else if (educationType === 0 && isEmpty(selectedBoard)) {
      alertBox('Please select the board');
    } else if (educationType === 0 && isEmpty(selectedClass)) {
      alertBox('Please select the class');
    } else if (
      educationType === 0 &&
      (selectedClass.name === 'Class 11' || selectedClass.name === 'Class 12') &&
      isEmpty(selectedStream)
    ) {
      alertBox('Please select the stream');
    } else if (educationType === 1 && isEmpty(selectedDegree)) {
      alertBox('Please select the degree');
    } else if (educationType === 1 && isEmpty(fieldOfStudy)) {
      alertBox('Please provide the field of study');
    } else if (isEmpty(startDate)) {
      alertBox('Please select the start date of education');
    } else if (isEmpty(endDate) && !isCurrent) {
      alertBox('Please select the end date of education');
    } else {
      return false;
    }
    return true;
  };

  const onSavingEducation = () => {
    if (!checkValues()) {
      const dto = {
        school: {
          name: schoolName,
        },
        startDate: startOfDay(startDate),
        endDate: endDate ? startOfDay(endDate) : null,
        isCurrent,
        ...(isStudent && {
          student: {
            id: studentInfo.id,
          },
        }),
        ...(!isStudent && {
          tutor: {
            id: tutorInfo.id,
          },
        }),
        ...(eduId && { id: eduId }),
      };
      if (educationType === 0) {
        dto.board = selectedBoard.name;
        dto.grade = selectedClass.name;
        if (selectedClass.name === 'Class 11' || selectedClass.name === 'Class 12') {
          // dto.subjects = selectedStream.label;
          dto.fieldOfStudy = selectedStream.label;
        }
      } else if (educationType === 1) {
        dto.degree = { degreeLevel: selectedDegree.degreeLevel, name: selectedDegree.name, id: selectedDegree.id };
        dto.fieldOfStudy = fieldOfStudy;
      }
      saveEducation({
        variables: {
          educationDto: dto,
        },
      });
    }
  };

  useEffect(() => {
    getDegreeData();
  }, []);

  const onSelectingDegree = (value) => {
    setSelectedDegree(value.data);
    setShowDegrees(false);
  };

  return (
    <>
      <Loader isLoading={educationLoading || degreeDataLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Education" horizontalPadding={RfW(16)} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          <Item floatingLabel>
            <Label style={commonStyles.smallMutedText}>Name of School/Institute</Label>
            <Input
              value={schoolName}
              onChangeText={(text) => setSchoolName(text)}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
          <View style={{ height: RfH(30) }} />
          <View style={{ flexDirection: 'row', paddingHorizontal: RfW(10) }}>
            <TouchableWithoutFeedback onPress={() => setEducationType(0)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton submitFunction={() => setEducationType(0)} enabled={educationType === 0} />
                <Text style={{ marginLeft: RfW(8) }}>K12 Education</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity
              onPress={() => setEducationType(1)}
              style={[commonStyles.horizontalChildrenView, { marginLeft: RfW(20) }]}
              activeOpacity={0.8}>
              <CustomRadioButton submitFunction={() => setEducationType(1)} enabled={educationType === 1} />
              <Text style={{ marginLeft: RfW(8) }}>Higher Education</Text>
            </TouchableOpacity>
          </View>
          {educationType === 0 ? (
            <View>
              <View style={{ height: RfH(24) }} />
              <Text style={commonStyles.smallMutedText}>Board</Text>
              <View>
                <Item style={commonStyles.horizontalChildrenSpaceView}>
                  {selectedBoard && (
                    <CustomSelect
                      data={boards.map((item) => ({ label: item.displayName, value: item }))}
                      value={selectedBoard}
                      onChangeHandler={(value) => value && setSelectedBoard(value)}
                      placeholder="Select Board"
                      containerStyle={{
                        flex: 1,
                        height: RfH(44),
                        justifyContent: 'center',
                      }}
                    />
                  )}
                </Item>
              </View>
              <View style={{ height: RfH(24) }} />
              {!isEmpty(selectedBoard) && (
                <View>
                  <Text style={commonStyles.smallMutedText}>Class</Text>
                  <Item style={commonStyles.horizontalChildrenSpaceView}>
                    <CustomSelect
                      data={offeringMasterData
                        .filter((item) => item?.parentOffering?.id === selectedBoard?.id)
                        .map((item) => ({ ...item, label: item.name, value: item }))}
                      value={selectedClass}
                      onChangeHandler={(value) => setSelectedClass(value)}
                      placeholder="Select Class"
                      containerStyle={{
                        flex: 1,
                        height: RfH(44),
                        justifyContent: 'center',
                      }}
                    />
                  </Item>
                </View>
              )}
              {(selectedClass.name === 'Class 11' || selectedClass.name === 'Class 12') && (
                <View>
                  <View style={{ height: RfH(24) }} />
                  <Text style={commonStyles.smallMutedText}>High School Stream</Text>
                  <View>
                    <Item style={commonStyles.horizontalChildrenSpaceView}>
                      <CustomSelect
                        data={highSchoolStreams}
                        value={selectedStream.value}
                        onChangeHandler={(stream) => setSelectedStream(stream)}
                        placeholder="Select stream"
                        containerStyle={{
                          flex: 1,
                          height: RfH(44),
                          justifyContent: 'center',
                        }}
                      />
                    </Item>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View>
              <View style={{ height: RfH(24) }} />
              <Text style={commonStyles.smallMutedText}>Degree</Text>
              <TouchableWithoutFeedback onPress={() => setShowDegrees(true)}>
                <View style={[commonStyles.lineSeparator, { flex: 0, paddingBottom: RfH(8) }]}>
                  <View style={[commonStyles.horizontalChildrenSpaceView, { paddingTop: RfH(12) }]}>
                    <Text>{!isEmpty(selectedDegree) ? selectedDegree.name : 'Please select degree'}</Text>
                    <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.expand} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View style={{ height: RfH(24) }} />
              <Item floatingLabel>
                <Label style={commonStyles.smallMutedText}>Field of Study</Label>
                <Input value={fieldOfStudy} onChangeText={(text) => setFieldOfStudy(text)} />
              </Item>
            </View>
          )}
          <View style={{ height: RfH(24) }} />
          <View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View style={{ flex: 0.5, marginRight: RfW(16) }}>
                <Text style={commonStyles.smallMutedText}>Start Date</Text>
                <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                  <CustomDatePicker
                    value={startDate}
                    onChangeHandler={(d) => {
                      setStartDate(d);
                      setEndDate('');
                    }}
                    maximumDate={new Date()}
                  />
                </View>
              </View>
              {!isCurrent && (
                <View style={{ flex: 0.5, marginLeft: RfW(16) }}>
                  <Text style={commonStyles.smallMutedText}>End Date</Text>
                  <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                    <CustomDatePicker
                      value={endDate}
                      onChangeHandler={(d) => setEndDate(d)}
                      minimumDate={new Date(startDate)}
                      maximumDate={new Date()}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={{ height: RfH(24) }} />
          <TouchableOpacity
            onPress={() => setIsCurrent(!isCurrent)}
            style={commonStyles.horizontalChildrenView}
            activeOpacity={0.8}>
            <CustomCheckBox enabled={isCurrent} submitFunction={() => setIsCurrent(!isCurrent)} />
            <Text style={{ marginLeft: RfW(16) }}>Currently studying</Text>
          </TouchableOpacity>
          <View style={{ height: RfH(24) }} />
          <View>
            <Button
              onPress={() => onSavingEducation()}
              block
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </View>
      </View>
      {showDegrees && (
        <DegreeModal
          degree={degree}
          isVisible={showDegrees}
          handleClose={() => setShowDegrees(false)}
          onSelectingDegree={onSelectingDegree}
        />
      )}
    </>
  );
}

export default AddEditEducation;
