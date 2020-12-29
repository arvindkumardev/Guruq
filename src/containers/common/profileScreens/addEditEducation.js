import { Alert, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Picker } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { CustomCheckBox, CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../../components';
import { studentDetails, tutorDetails, userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import routeNames from '../../../routes/screenNames';
import { ADD_UPDATE_EDUCATION_DETAILS } from '../graphql-mutation';

function AddEditEducation() {
  const navigation = useNavigation();
  const studentInfo = useReactiveVar(studentDetails);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [schoolName, setSchoolName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedDegree, setSelectedDegree] = useState('B.Tech');
  const [selectedClass, setSelectedClass] = useState('1');
  const [selectedStream, setSelectedStream] = useState('Commerce');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [educationType, setEducationType] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [saveEducation, { loading: educationLoading }] = useMutation(ADD_UPDATE_EDUCATION_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Details updated!');
      }
    },
  });

  const onSavingEducation = () => {
    const dto = {
      school: {
        name: schoolName,
      },
      startDate,
      endDate,
      isCurrent,
      student: {
        id: 27716,
      },
      tutor: {
        id: 27716,
      },
    };
    if (educationType === 0) {
      dto.board = selectedBoard;
      dto.grade = selectedClass;
      if (selectedClass > 10) {
        dto.subjects = selectedStream;
      }
    } else if (educationType === 1) {
      dto.degree.name = selectedDegree;
      dto.fieldOfStudy = fieldOfStudy;
    }
    saveEducation({
      variables: {
        educationDto: dto,
      },
    });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Education" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Name of School or Institute</Text>
          <Item>
            <Input value={schoolName} onChangeText={(text) => setSchoolName(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <TouchableWithoutFeedback onPress={() => setEducationType(0)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton submitFunction={() => setEducationType(0)} enabled={educationType === 0} />
              <Text style={{ marginLeft: RfW(8) }}>K12 Education</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setEducationType(1)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton submitFunction={() => setEducationType(1)} enabled={educationType === 1} />
              <Text style={{ marginLeft: RfW(8) }}>Higher Education</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {educationType === 0 ? (
          <View>
            <View style={{ height: RfH(24) }} />
            <Text style={commonStyles.smallMutedText}>Board</Text>
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
              <Text style={commonStyles.smallMutedText}>Class</Text>
              <Item style={commonStyles.horizontalChildrenSpaceView}>
                <Picker
                  iosHeader="Select Class"
                  Header="Select Class"
                  mode="dropdown"
                  placeholder="Select Class"
                  placeholderStyle={{ fontSize: 15 }}
                  selectedValue={selectedClass}
                  onValueChange={(value) => setSelectedClass(value)}>
                  <Picker.Item label="1" value="1" key="1" />
                  <Picker.Item label="2" value="2" key="2" />
                  <Picker.Item label="3" value="3" key="3" />
                  <Picker.Item label="4" value="4" key="4" />
                  <Picker.Item label="5" value="5" key="5" />
                  <Picker.Item label="6" value="6" key="6" />
                  <Picker.Item label="7" value="7" key="7" />
                  <Picker.Item label="8" value="8" key="8" />
                  <Picker.Item label="9" value="9" key="9" />
                  <Picker.Item label="10" value="10" key="10" />
                  <Picker.Item label="11" value="11" key="11" />
                  <Picker.Item label="12" value="12" key="12" />
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
                <Text style={commonStyles.smallMutedText}>High School Stream</Text>
                <View>
                  <Item style={commonStyles.horizontalChildrenSpaceView}>
                    <Picker
                      iosHeader="Select Stream"
                      Header="Select Stream"
                      mode="dropdown"
                      placeholder="Select Stream"
                      placeholderStyle={{ fontSize: 15 }}
                      selectedValue={selectedStream}
                      onValueChange={(value) => setSelectedStream(value)}>
                      <Picker.Item label="Commerce" value="Commerce" key="Commerce" />
                      <Picker.Item label="Humanities" value="Humanities" key="Humanities" />
                      <Picker.Item label="Science" value="Science" key="Science" />
                    </Picker>
                    <IconButtonWrapper
                      styling={{ alignSelf: 'flex-end' }}
                      iconHeight={RfH(24)}
                      iconWidth={RfW(24)}
                      iconImage={Images.expand}
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
              <Text style={commonStyles.smallMutedText}>Field of Study</Text>
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
              <Text style={commonStyles.smallMutedText}>Start Date</Text>
              <View style={{ height: RfH(56), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                <CustomDatePicker value={startDate} onChangeHandler={(d) => setStartDate(d)} />
              </View>
            </View>
            <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>End Date</Text>
              <View style={{ height: RfH(56), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                <CustomDatePicker value={endDate} onChangeHandler={(d) => setEndDate(d)} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <TouchableWithoutFeedback onPress={() => setIsCurrent(!isCurrent)}>
          <View style={commonStyles.horizontalChildrenView}>
            <CustomCheckBox enabled={isCurrent} />
            <Text style={{ marginLeft: RfW(16) }}>Currently studying</Text>
          </View>
        </TouchableWithoutFeedback>
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
