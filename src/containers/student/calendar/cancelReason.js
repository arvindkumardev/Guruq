import { Image, Text, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { CustomRadioButton, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function CancelReason() {
  const [reasons, setReasons] = useState([
    { reason: 'I am unavailable to take classes at this moment.', selected: true },
    { reason: 'I want to replace the tutor with other.', selected: false },
    { reason: 'I did not find tutor reliable.', selected: false },
    { reason: 'I am unsatisfied with the quality of tutor.', selected: false },
    { reason: 'Others', selected: false },
  ]);

  const renderReasons = (item) => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenView}>
          <CustomRadioButton enabled={item.selected} />
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>{item.reason}</Text>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginVertical: RfH(16) }} />
      </View>
    );
  };
  return (
    <View style={commonStyles.mainContainer}>
      <ScreenHeader label="Cancel Reason" homeIcon />
      <View style={{ height: RfH(44) }} />
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={reasons}
          renderItem={({ item, index }) => renderReasons(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={{ marginTop: RfH(32) }}>
        <Button style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Submit</Text>
        </Button>
      </View>
    </View>
  );
}

export default CancelReason;
