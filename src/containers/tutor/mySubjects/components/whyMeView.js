import { Alert, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Textarea } from 'native-base';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { alertBox, RfH } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../tutor.mutation';

function WhyMeView(props) {
  const navigation = useNavigation();
  const { offering, showLoader } = props;
  const [description, setDescription] = useState(offering.description);

  const [updateOffering, { loading: offeringLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Description updated successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onUpdatingOffering = () => {
    showLoader(offeringLoading);
    updateOffering({
      variables: {
        tutorOfferingDto: {
          id: offering.id,
          description,
          offering: { id: offering?.offering?.id },
        },
      },
    });
  };

  return (
    <View>
      <View style={{ height: RfH(20) }} />
      {/* <Text style={commonStyles.regularPrimaryText}>Description</Text> */}
      <Text style={[commonStyles.regularMutedText, { marginTop: RfH(12) }]}>
        Describe why student should study with you.
      </Text>
      <Textarea
        numberOfLines={12}
        style={{
          backgroundColor: Colors.lightGrey,
          marginTop: RfH(12),
          borderRadius: 8,
          height: RfH(150),
          padding: RfH(15),
        }}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      {/* <View style={{ height: RfH(24) }} /> */}
      {/* <Text style={[commonStyles.regularMutedText, { marginTop: RfH(12) }]}>Video Describing you</Text> */}
      {/* <Item */}
      {/*  style={{ */}
      {/*    backgroundColor: Colors.lightGrey, */}
      {/*    marginTop: RfH(12), */}
      {/*    borderRadius: 8, */}
      {/*    height: RfH(44), */}
      {/*    padding: RfH(8), */}
      {/*    borderBottomWidth: 0, */}
      {/*  }}> */}
      {/*  <Input onChangeText={(text) => setVideoUrl(text)} /> */}
      {/* </Item> */}
      <View style={{ height: RfH(30) }} />
      <Button onPress={onUpdatingOffering} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Save</Text>
      </Button>
    </View>
  );
}

export default WhyMeView;
