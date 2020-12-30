import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Picker } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CustomCheckBox, IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS } from '../graphql-mutation';
import { EmploymentTypeEnum } from '../enums';
import { tutorDetails } from '../../../apollo/cache';

function AddEditExperience() {
  const tutorInfo = useReactiveVar(tutorDetails);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [selectedType, setSelectedType] = useState(EmploymentTypeEnum.FULL_TIME.label);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCurrent, setIsCurrent] = useState(false);

  const [saveExperience, { loading: experienceLoading }] = useMutation(ADD_UPDATE_TUTOR_EXPERIENCE_DETAILS, {
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

  const onSavingExperience = () => {
    saveExperience({
      variables: {
        experienceDto: {
          title: jobTitle,
          startDate,
          endDate,
          current: isCurrent,
          employmentType: selectedType,
          institution: {
            name: companyName,
            address: {
              fullAddress: jobLocation,
            },
          },
          tutor: {
            id: tutorInfo?.id,
          },
        },
      },
    });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Experience" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.smallMutedText}>Company name</Text>
        <Item>
          <Input value={companyName} onChangeText={(text) => setCompanyName(text)} />
        </Item>
        <View style={{ height: RfH(24) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Title</Text>
          <Item>
            <Input value={jobTitle} onChangeText={(text) => setJobTitle(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Employment type</Text>
        <View>
          <Item style={commonStyles.horizontalChildrenSpaceView}>
            <Picker
              iosHeader="Select employment type"
              Header="Select employment type"
              mode="dropdown"
              placeholder="Select employment type"
              placeholderStyle={{ fontSize: 15 }}
              selectedValue={selectedType}
              onValueChange={(value) => setSelectedType(value)}>
              <Picker.Item
                label="Full-time"
                value={EmploymentTypeEnum.FULL_TIME.label}
                key={EmploymentTypeEnum.FULL_TIME.label}
              />
              <Picker.Item
                label="Part-time"
                value={EmploymentTypeEnum.PART_TIME.label}
                key={EmploymentTypeEnum.PART_TIME.label}
              />
              <Picker.Item
                label="Self-Employed"
                value={EmploymentTypeEnum.SELF_EMPLOYED.label}
                key={EmploymentTypeEnum.SELF_EMPLOYED.label}
              />
              <Picker.Item
                label="Freelance"
                value={EmploymentTypeEnum.FREELANCE.label}
                key={EmploymentTypeEnum.FREELANCE.label}
              />
              <Picker.Item
                label="Internship"
                value={EmploymentTypeEnum.INTERNSHIP.label}
                key={EmploymentTypeEnum.INTERNSHIP.label}
              />
              <Picker.Item
                label="Trainee"
                value={EmploymentTypeEnum.TRAINEE.label}
                key={EmploymentTypeEnum.TRAINEE.label}
              />
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
          <Text style={commonStyles.smallMutedText}>Location</Text>
          <Item>
            <Input value={jobLocation} onChangeText={(text) => setJobLocation(text)} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>Start Date</Text>
              <View style={{ height: RfH(56), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                <CustomDatePicker value={startDate} onChangeHandler={(d) => setStartDate(d)} />
              </View>
            </View>
            <View style={{ flex: 0.5, marginLeft: RfW(16) }}>
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
            <CustomCheckBox enabled={isCurrent} submitFunction={() => setIsCurrent(!isCurrent)} />
            <Text style={{ marginLeft: RfW(16) }}>Currently working</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={{ height: RfH(24) }} />
        <View>
          <Button
            onPress={() => onSavingExperience()}
            block
            style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AddEditExperience;
