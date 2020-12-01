import { Image, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Images, Colors } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { RfH, RfW } from '../../../utils/helpers';
import { IconButtonWrapper, RateReview, ScreenHeader } from '../../../components';

function OnlineClass() {
  const [showReviewPopup, setShowReviewPopup] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      <Image style={{ flex: 1 }} source={Images.online_top_img} />
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Image source={Images.online_left} />
        <Image source={Images.online_right} />
      </View>
      <View
        style={{
          height: RfH(82),
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: Colors.lightGreyColors,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: RfH(34),
        }}>
        <View
          style={{
            height: RfH(44),
            width: RfH(44),
            borderRadius: RfH(22),
            backgroundColor: Colors.darkGrey,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconImage={Images.video}
            iconHeight={RfH(16)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'center' }}
          />
        </View>
        <View
          style={{
            height: RfH(44),
            width: RfH(44),
            borderRadius: RfH(22),
            backgroundColor: Colors.orangeRed,
            marginHorizontal: RfW(28),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconImage={Images.video}
            iconHeight={RfH(16)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'center' }}
          />
        </View>
        <View
          style={{
            height: RfH(44),
            width: RfH(44),
            borderRadius: RfH(22),
            backgroundColor: Colors.darkGrey,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconImage={Images.video}
            iconHeight={RfH(16)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'center' }}
          />
        </View>
      </View>
      <RateReview visible={showReviewPopup} onClose={() => setShowReviewPopup(false)} />
    </View>
  );
}

export default OnlineClass;
