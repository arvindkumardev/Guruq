import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { ADD_UPDATE_AWARD_DETAILS } from './award.mutation';
import { tutorDetails } from '../../../apollo/cache';

function AddEditAward(props) {
  const navigation = useNavigation();
  const tutorInfo = useReactiveVar(tutorDetails);
  const awardDetail = props?.route?.params?.detail;
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [description, setDescription] = useState();
  const [date, setDate] = useState();
  const [awardId, setAwardId] = useState('');

  useEffect(() => {
    if (!isEmpty(awardDetail)) {
      setTitle(awardDetail.title);
      setIssuer(awardDetail.issuer);
      setDescription(awardDetail.description);
      setDate(awardDetail.date);
      setAwardId(awardDetail?.id);
    }
  }, [awardDetail]);

  const [saveAwardDetail, { loading: awardDetailLoading }] = useMutation(ADD_UPDATE_AWARD_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox(`Award ${awardId ? 'saved' : 'submit'} successfully!`, '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSavingAward = () => {
    if (isEmpty(title)) {
      alertBox('Please provide the awards/achievement title');
    } else if (isEmpty(issuer)) {
      alertBox('Please provide the awards/achievement issuer name');
    } else if (isEmpty(description)) {
      alertBox('Please provide a description');
    } else if (isEmpty(date)) {
      alertBox('Please select the award issue date');
    } else {
      saveAwardDetail({
        variables: {
          awardDto: {
            title,
            issuer,
            description,
            date,
            tutor: {
              id: tutorInfo.id,
            },
            ...(awardId && { id: awardId }),
          },
        },
      });
    }
  };

  return (
    <>
      <Loader isLoading={awardDetailLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Add/Edit A Award" horizontalPadding={RfW(16)} lineVisible />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label style={commonStyles.regularMutedText}>Title</Label>
            <Input value={title} onChangeText={(text) => setTitle(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label style={commonStyles.regularMutedText}>Issuer</Label>
              <Input value={issuer} onChangeText={(text) => setIssuer(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label style={commonStyles.regularMutedText}>Description</Label>
              <Input value={description} onChangeText={(text) => setDescription(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.regularMutedText}>Issue Date</Text>
                <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                  <CustomDatePicker
                    placeholder="Select the award date"
                    value={date}
                    onChangeHandler={(d) => setDate(d)}
                    maximumDate={new Date()}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: RfH(40) }} />
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <Button onPress={onSavingAward} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>{awardId ? 'Save' : 'Submit'}</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

export default AddEditAward;
