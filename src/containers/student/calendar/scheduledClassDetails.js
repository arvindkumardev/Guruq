import { Text, View } from 'react-native';
import React from 'react';
import { Button } from 'native-base';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { IconButtonWrapper } from '../../../components';
import commonStyles from '../../../theme/styles';

function scheduledClassDetails() {
  return (
    <View>
      <View
        style={{
          height: RfH(116),
          backgroundColor: Colors.lightPurple,
          paddingTop: RfH(44),
          paddingHorizontal: RfW(16),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <IconButtonWrapper iconHeight={RfH(24)} iconImage={Images.backArrow} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
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
    </View>
  );
}

export default scheduledClassDetails;
