import { Image, Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors, Fonts } from '../../theme';
import routeNames from '../../routes/screenNames';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { IconButtonWrapper, ScreenHeader } from '../../components';

function PostTutionNeeds() {
  const navigation = useNavigation();

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <Text>Post needs</Text>
    </View>
  );
}

export default PostTutionNeeds;
