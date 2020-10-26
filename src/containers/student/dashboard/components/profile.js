import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH } from '../../../../utils/helpers';

function profile() {

  return (
    <View style={commonStyles.mainContainer}>
      <Text style={{marginTop:RfH(48), fontSize:20, fontWeight:'bold'}}>
        My Profile
      </Text>
      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'stretch'}}>
       
      </View>
    </View>
  );
}

export default profile;
