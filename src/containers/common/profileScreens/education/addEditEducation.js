import { Alert, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label, Picker } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import {
  CustomCheckBox,
  CustomRadioButton,
  CustomSelect,
  IconButtonWrapper,
  ScreenHeader,
} from '../../../../components';
import { offeringsMasterData, studentDetails, tutorDetails, userType } from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { alertBox, RfH, RfW, startOfDay } from '../../../../utils/helpers';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import { ADD_UPDATE_EDUCATION_DETAILS } from './education.mutation';
import { SCHOOL_EDUCATION } from '../../../../utils/constants';
import { DegreeLevelEnum, HighSchoolStreamEnum } from '../../enums';
import { UserTypeEnum } from '../../../../common/userType.enum';

function AddEditEducation() {
  const navigation = useNavigation();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const studentInfo = useReactiveVar(studentDetails);
  const tutorInfo = useReactiveVar(tutorDetails);
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const schoolEducation = offeringMasterData.find((s) => s.level === 0 && s.name === SCHOOL_EDUCATION);
  const boards = offeringMasterData.filter((s) => s?.parentOffering?.id === schoolEducation?.id);

  const degreeData = [];
  Object.keys(DegreeLevelEnum).forEach(function (key) {
    degreeData.push({ value: DegreeLevelEnum[key], label: key });
  });

  const highSchoolStreams = [];
  Object.keys(HighSchoolStreamEnum).forEach(function (key) {
    highSchoolStreams.push({ value: HighSchoolStreamEnum[key], label: key });
  });

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
      };
      if (educationType === 0) {
        dto.board = selectedBoard.name;
        dto.grade = selectedClass.name;
        if (selectedClass.name === 'Class 11' || selectedClass.name === 'Class 12') {
          dto.subjects = selectedStream.label;
        }
      } else if (educationType === 1) {
        dto.degree = { name: selectedDegree.label };
        dto.fieldOfStudy = fieldOfStudy;
      }
      console.log('dto', dto);
      saveEducation({
        variables: {
          educationDto: dto,
        },
      });
    }
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Education" horizontalPadding={RfW(16)} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <View>
          <Item floatingLabel>
            <Label>Name of School/Institute</Label>
            <Input
              value={schoolName}
              onChangeText={(text) => setSchoolName(text)}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
        </View>
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
            <Text style={commonStyles.regularMutedText}>Board</Text>
            <View>
              <Item style={commonStyles.horizontalChildrenSpaceView}>
                <Picker
                  iosHeader="Select board"
                  Header="Select board"
                  mode="dropdown"
                  placeholder="Select Board"
                  placeholderStyle={{ fontSize: 15 }}
                  selectedValue={selectedBoard}
                  onValueChange={(value) => setSelectedBoard(value)}>
                  <Picker.Item label="CBSE" value="CBSE" key="CBSE" />
                  <Picker.Item label="ICSE" value="ICSE" key="ICSE" />
                  <Picker.Item label="IB" value="IB" key="IB" />
                  <Picker.Item label="IGSCE" value="IGSCE" key="IGSCE" />
                </Picker>
                <IconButtonWrapper
                  styling={{ alignSelf: 'flex-end' }}
                  iconHeight={RfH(24)}
                  iconWidth={RfW(24)}
                  iconImage={Images.expand}
                />
              </Item>
            </View>
            <View style={{ height: RfH(24) }} />
            <View>
              <Text style={commonStyles.regularMutedText}>Class</Text>
              <Item style={commonStyles.horizontalChildrenSpaceView}>
                <Picker
                  iosHeader="Select Class"
                  Header="Select Class"
                  mode="dropdown"
                  placeholder="Select Class"
                  placeholderStyle={{ fontSize: 15 }}
                  selectedValue={selectedClass}
                  onValueChange={(value) => setSelectedClass(value)}>
                  <Picker.Item label="Class 1" value="1" key="1" />
                  <Picker.Item label="Class 2" value="2" key="2" />
                  <Picker.Item label="Class 3" value="3" key="3" />
                  <Picker.Item label="Class 4" value="4" key="4" />
                  <Picker.Item label="Class 5" value="5" key="5" />
                  <Picker.Item label="Class 6" value="6" key="6" />
                  <Picker.Item label="Class 7" value="7" key="7" />
                  <Picker.Item label="Class 8" value="8" key="8" />
                  <Picker.Item label="Class 9" value="9" key="9" />
                  <Picker.Item label="Class 10" value="10" key="10" />
                  <Picker.Item label="Class 11" value="11" key="11" />
                  <Picker.Item label="Class 12" value="12" key="12" />
                </Picker>
                <IconButtonWrapper
                  styling={{ alignSelf: 'flex-end' }}
                  iconHeight={RfH(24)}
                  iconWidth={RfW(24)}
                  iconImage={Images.expand}
                />
              </Item>
            </View>
            {selectedClass > 10 && (
              <View>
                <View style={{ height: RfH(24) }} />
                <Text style={commonStyles.regularMutedText}>High School Stream</Text>
                <View>
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
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={{ height: RfH(24) }} />
            <Text style={commonStyles.regularMutedText}>Degree</Text>
            <View>
              <Item style={commonStyles.horizontalChildrenSpaceView}>
                <Picker
                  iosHeader="Select degree"
                  Header="Select degree"
                  mode="dropdown"
                  placeholder="Select degree"
                  placeholderStyle={{ fontSize: 15 }}
                  selectedValue={selectedDegree}
                  onValueChange={(value) => setSelectedDegree(value)}>
                  <Picker.Item label="B.Tech" value="B.Tech" key="B.Tech" />
                  <Picker.Item label="MBA" value="MBA" key="MBA" />
                  <Picker.Item label="MSC" value="MSC" key="MSC" />
                  <Picker.Item label="BBA" value="BBA" key="BBA" />
                </Picker>
                <IconButtonWrapper
                  styling={{ alignSelf: 'flex-end' }}
                  iconHeight={RfH(24)}
                  iconWidth={RfW(24)}
                  iconImage={Images.expand}
                />
              </Item>
            </View>
            <View style={{ height: RfH(24) }} />
            <View>
              <Text style={commonStyles.regularMutedText}>Field of Study</Text>
              <Item>
                <Input value={fieldOfStudy} onChangeText={(text) => setFieldOfStudy(text)} />
              </Item>
            </View>
          </View>
        )}
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Text style={commonStyles.regularMutedText}>Start Date</Text>
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
                <Text style={commonStyles.regularMutedText}>End Date</Text>
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
  );
}

export default AddEditEducation;
