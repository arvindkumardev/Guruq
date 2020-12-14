import { Image, Text, View } from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper } from '../../../components';
import { Images } from '../../../theme';

function Performance() {
  return (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <View style={{ height: RfH(88) }} />
      <Text style={commonStyles.pageTitleThirdRow}>Performance</Text>
      <View style={{ height: RfH(44) }} />
      <Text style={commonStyles.headingPrimaryText}>Statistics</Text>
      <View style={{ height: RfH(24) }} />
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper iconWidth={RfW(24)} iconImage={Images.b_star} iconHeight={RfH(24)} />
          <Text style={{ marginLeft: RfW(8) }}>4.5</Text>
          <Text style={[commonStyles.regularMutedText, { marginLeft: RfW(8) }]}>Overall rating</Text>
        </View>
        <View style={commonStyles.horizontalChildrenView}>
          <Text>95</Text>
          <Text style={[commonStyles.regularMutedText, { marginLeft: RfW(12) }]}>Reviews</Text>
        </View>
      </View>
      <View style={{ height: RfH(32) }} />
      <View style={commonStyles.lineSeparator} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
        <View style={commonStyles.horizontalChildrenView}>
          <Text>₹500.00</Text>
          <Text style={[commonStyles.regularMutedText, { marginLeft: RfW(8) }]}>September earnings</Text>
        </View>
        <View style={commonStyles.horizontalChildrenView}>
          <Text>07</Text>
          <Text style={[commonStyles.regularMutedText, { marginLeft: RfW(12) }]}>Bookings</Text>
        </View>
      </View>
      <View style={{ height: RfH(32) }} />
      <View style={commonStyles.lineSeparator} />
      <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(16), height: RfH(88) }]}>
        <View style={{ width: RfW(8), backgroundColor: Colors.lightBlue }} />
      </View>
    </View>
  );
}

export default Performance;
