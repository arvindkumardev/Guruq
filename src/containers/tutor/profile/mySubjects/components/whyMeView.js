import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Textarea } from 'native-base';
import { RfH, RfW } from '../../../../../utils/helpers';
import commonStyles from '../../../../../theme/styles';
import { Colors } from '../../../../../theme';

function WhyMeView() {
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
        }}>
        <Input onChangeText={(text) => setVideoUrl(text)} />
      </Item>
      <View style={{ height: RfH(30) }} />
      <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Save</Text>
      </Button>
    </View>
  );
}

export default WhyMeView;
