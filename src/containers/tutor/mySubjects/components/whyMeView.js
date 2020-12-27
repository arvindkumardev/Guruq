import { Alert, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Textarea } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../tutor.mutation';
import { tutorDetails } from '../../../../apollo/cache';

function WhyMeView(props) {
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const tutorInfo = useReactiveVar(tutorDetails);
  const { selectedOffering, showLoader } = props;

  const [updateOffering, { loading: offeringLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Updated!');
      }
    },
  });

  const onUpdatingOffering = () => {
    showLoader(offeringLoading);
    updateOffering({
      variables: {
        tutorOfferingDto: {
          id: selectedOffering.id,
          tutor: { id: tutorInfo?.id },
          description,
          videoLink: videoUrl,
          offering: { id: selectedOffering?.offering?.id },
        },
      },
    });
  };

  return (
    <View>
      <View style={{ height: RfH(32) }} />
      <Text style={commonStyles.regularPrimaryText}>Description</Text>
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
          padding: RfH(8),
        }}
        onChangeText={(text) => setDescription(text)}
      />
      <View style={{ height: RfH(24) }} />
      <Text style={[commonStyles.regularMutedText, { marginTop: RfH(12) }]}>Video Describing you</Text>
      <Item
        style={{
          backgroundColor: Colors.lightGrey,
          marginTop: RfH(12),
          borderRadius: 8,
          height: RfH(44),
          padding: RfH(8),
          borderBottomWidth: 0,
        }}>
        <Input onChangeText={(text) => setVideoUrl(text)} />
      </Item>
      <View style={{ height: RfH(30) }} />
      <Button onPress={() => onUpdatingOffering()} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Save</Text>
      </Button>
    </View>
  );
}

export default WhyMeView;
