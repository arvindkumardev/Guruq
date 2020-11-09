import { Text, View } from 'react-native';
import React from 'react';
import { Button } from 'native-base';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { IconButtonWrapper } from '../../../components';
import commonStyles from '../../../theme/styles';

function ScheduledClassDetails() {
  return (
    <View>
      <View
        style={{
          height: RfH(116),
          backgroundColor: Colors.lightPurple,
          paddingTop: RfH(44),
          paddingLeft: RfW(8),
          paddingRight: RfW(16),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <IconButtonWrapper iconHeight={RfH(24)} iconImage={Images.backArrow} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { flex: 1 }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <Text style={commonStyles.pageTitle}>English Class</Text>
            <Text style={[commonStyles.secondaryText, { marginTop: RfH(4) }]}>CBSE | Class 9</Text>
          </View>
          <View style={{ alignSelf: 'flex-end' }}>
            <Button style={[commonStyles.buttonPrimary, { width: RfH(96), marginRight: 0 }]}>
              <Text style={commonStyles.textButtonPrimary}>Start Class</Text>
            </Button>
          </View>
        </View>
      </View>
      <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(24) }]}>
        <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.two_users} />
        <Text style={[commonStyles.headingText, { marginLeft: RfW(16) }]}>Tutor</Text>
      </View>
    </View>
  );
}

export default ScheduledClassDetails;
