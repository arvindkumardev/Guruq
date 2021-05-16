import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Textarea } from 'native-base';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors } from '../../../../theme';
import { CREATE_UPDATE_TUTOR_OFFERINGS } from '../../tutor.mutation';
import { ScreenHeader, Loader } from '../../../../components';

const WhyMeView = (props) => {
  const navigation = useNavigation();
  // const { offering,  } = props;
  const { route } = props;

  const offering = route?.params?.offering;
  console.log('offering is inside why me ', offering);
  const [description, setDescription] = useState(offering.description);

  const [updateOffering, { loading: offeringLoading }] = useMutation(CREATE_UPDATE_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
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
    <View style={{ backgroundColor: Colors.white, height: '100%' }}>
      <ScreenHeader label="Why Me" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ height: RfH(20) }} />
      <Loader isLoading={offeringLoading} />
      <View style={{ paddingHorizontal: RfW(16) }}>
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
            padding: RfH(15),
          }}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        <View style={{ height: RfH(30) }} />
        <Button onPress={onUpdatingOffering} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default WhyMeView;
