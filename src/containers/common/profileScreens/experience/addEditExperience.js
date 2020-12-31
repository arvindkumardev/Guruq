import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { CustomCheckBox, CustomSelect, Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import { ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS } from './experience.mutation';
import { EmploymentTypeEnum } from '../../enums';
import { tutorDetails } from '../../../../apollo/cache';

const EMPLOYMENT_TYPE = [
  { value: 1, label: 'FULL TIME' },
  { value: 2, label: 'PART TIME' },
  { value: 3, label: 'SELF EMPLOYED' },
  { value: 4, label: 'FREELANCE' },
  { value: 5, label: 'INTERNSHIP' },
  { value: 6, label: 'TRAINEE' },
];
function AddEditExperience(props) {
  const navigation = useNavigation();
  const tutorInfo = useReactiveVar(tutorDetails);
  const experienceDetail = props?.route?.params?.detail;
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCurrent, setIsCurrent] = useState(false);
  const [expId, setExpId] = useState('');

  useEffect(() => {
    if (!isEmpty(experienceDetail)) {
      setIsCurrent(experienceDetail.current);
      setEndDate(experienceDetail.endDate);
      setStartDate(experienceDetail.startDate);
      setSelectedType(EmploymentTypeEnum[experienceDetail.employmentType].value);
      setJobTitle(experienceDetail.title);
      setCompanyName(experienceDetail?.institution?.name);
      setExpId(experienceDetail?.id);
    }
  }, [experienceDetail]);

  const [saveExperience, { loading: experienceLoading }] = useMutation(ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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
      saveExperience({
        variables: {
          experienceDto: {
            id: expId,
            title: jobTitle,
            startDate,
            endDate,
            current: isCurrent,
            employmentType: EMPLOYMENT_TYPE.find((item) => item.value === selectedType).label,
            institution: {
              name: companyName,
            },
            tutor: {
              id: tutorInfo.id,
            },
          },
        },
      });
    }
  };
  console.log('endDate', endDate);

  return (
    <>
      <Loader isLoading={experienceLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Experience" horizontalPadding={RfW(16)} lineVisible={false} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          <Text style={commonStyles.smallMutedText}>Name of Company/Institute</Text>
          <Item>
            <Input value={companyName} onChangeText={(text) => setCompanyName(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Text style={commonStyles.smallMutedText}>Job Title</Text>
            <Item>
              <Input value={jobTitle} onChangeText={(text) => setJobTitle(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <Text style={commonStyles.smallMutedText}>Employment type</Text>
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
