import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { CustomCheckBox, CustomSelect, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { alertBox, printDateTime, RfH, RfW, startOfDay } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS } from './experience.mutation';
import { EmploymentTypeEnum } from '../../common/enums';
import { tutorDetails } from '../../../apollo/cache';

const EMPLOYMENT_TYPE = [
  { value: 'FULL_TIME', label: 'FULL TIME' },
  { value: 'PART_TIME', label: 'PART TIME' },
  { value: 'SELF_EMPLOYED', label: 'SELF EMPLOYED' },
  { value: 'FREELANCE', label: 'FREELANCE' },
  { value: 'INTERNSHIP', label: 'INTERNSHIP' },
  { value: 'TRAINEE', label: 'TRAINEE' },
];
function AddEditExperience(props) {
  const navigation = useNavigation();
  const tutorInfo = useReactiveVar(tutorDetails);
  const experienceDetail = props?.route?.params?.detail;
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [expId, setExpId] = useState('');

  useEffect(() => {
    if (!isEmpty(experienceDetail)) {
      setIsCurrent(experienceDetail.current);
      setEndDate(experienceDetail.endDate);
      setStartDate(experienceDetail.startDate);
      setSelectedType(EmploymentTypeEnum[experienceDetail.employmentType].label);
      setJobTitle(experienceDetail.title);
      setCompanyName(experienceDetail?.institution?.name);
      setExpId(experienceDetail?.id);
    }
  }, [experienceDetail]);

  const [saveExperience, { loading: experienceLoading }] = useMutation(ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Experience saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSavingExperience = () => {
    if (isEmpty(jobTitle)) {
      alertBox('Please provide the job title');
    } else if (isEmpty(companyName)) {
      alertBox('Please provide the company/institute name');
    } else if (isEmpty(selectedType.toString())) {
      alertBox('Please select the employment type');
    } else if (isEmpty(startDate)) {
      alertBox('Please select the start date of the employment');
    } else if (isEmpty(endDate) && !isCurrent) {
      alertBox('Please select the end date of the employment');
    } else {
      const payload = {
        title: jobTitle,
        startDate: startOfDay(startDate),
        endDate: endDate ? startOfDay(endDate) : null,
        current: isCurrent,
        employmentType: EMPLOYMENT_TYPE.find((item) => item.value === selectedType).value,
        institution: {
          name: companyName,
        },
        tutor: {
          id: tutorInfo.id,
        },
        ...(expId && { id: expId }),
      };
      saveExperience({
        variables: {
          experienceDto: payload,
        },
      });
    }
  };

  return (
    <>
      <Loader isLoading={experienceLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Experience" horizontalPadding={RfW(16)} lineVisible={false} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          <Item floatingLabel>
            <Label>Name of Company/Institute</Label>
            <Input value={companyName} onChangeText={(text) => setCompanyName(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label>Job Title</Label>
              <Input value={jobTitle} onChangeText={(text) => setJobTitle(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.regularMutedText}>Employment type</Text>
          <View>
            <Item>
              <CustomSelect
                data={EMPLOYMENT_TYPE}
                value={selectedType}
                onChangeHandler={(value) => setSelectedType(value)}
                placeholder="Select Employment type"
                containerStyle={{
                  flex: 1,
                  height: RfH(44),
                  justifyContent: 'center',
                }}
              />
            </Item>
          </View>
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
            <Text style={{ marginLeft: RfW(16) }}>Currently working</Text>
          </TouchableOpacity>

          <View style={{ height: RfH(40) }} />
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <Button onPress={onSavingExperience} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

export default AddEditExperience;
