import { Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import NavigationRouteNames from '../../../routes/screenNames';
import { Images, Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function RateAndReviews() {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.mainContainer}>
      <ScreenHeader homeIcon label="Rate & Review" />
      <View style={[commonStyles.verticallyCenterItemsView, { marginTop: RfH(132), alignSelf: 'center' }]}>
        <IconButtonWrapper
          iconWidth={RfW(96)}
          iconHeight={RfH(96)}
          iconImage={Images.kushal}
          styling={{ borderRadius: 8 }}
        />
        <Text style={[commonStyles.headingPrimaryText, { marginTop: RfH(8) }]}>Gurbani Singh</Text>
        <Text style={commonStyles.mediumMutedText}>English ( Class 6-12 I CBSE)</Text>
        <View style={{ height: RfH(32) }} />
        <Text style={commonStyles.mediumMutedText}>Rate Your Tutor</Text>
        <View style={{ height: RfH(32) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <IconButtonWrapper
            iconHeight={RfH(42)}
            iconWidth={RfW(42)}
            iconImage={Images.grey_star}
            styling={{ marginHorizontal: RfW(8) }}
          />
          <IconButtonWrapper
            iconHeight={RfH(42)}
            iconWidth={RfW(42)}
            iconImage={Images.grey_star}
            styling={{ marginHorizontal: RfW(8) }}
          />
          <IconButtonWrapper
            iconHeight={RfH(42)}
            iconWidth={RfW(42)}
            iconImage={Images.grey_star}
            styling={{ marginHorizontal: RfW(8) }}
          />
          <IconButtonWrapper
            iconHeight={RfH(42)}
            iconWidth={RfW(42)}
            iconImage={Images.grey_star}
            styling={{ marginHorizontal: RfW(8) }}
          />
          <IconButtonWrapper
            iconHeight={RfH(42)}
            iconWidth={RfW(42)}
            iconImage={Images.grey_star}
            styling={{ marginHorizontal: RfW(8) }}
            submitFunction={() => navigation.navigate(NavigationRouteNames.STUDENT.DETAILED_RATING)}
          />
        </View>
      </View>
      <View style={{ bottom: 0, left: 0, right: 0, position: 'absolute', marginBottom: RfH(82) }}>
        <Text style={{ fontSize: RFValue(12, STANDARD_SCREEN_SIZE), textAlign: 'center', color: Colors.darkGrey }}>
          Your words makes GuruQ a better place
        </Text>
      </View>
    </View>
  );
}

export default RateAndReviews;
