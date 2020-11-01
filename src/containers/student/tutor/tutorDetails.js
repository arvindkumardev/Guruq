import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { IconButtonWrapper } from '../../../components';

function tutorDetails() {
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0 }]}>
      <View
        style={[
          styles.topView,
          { paddingTop: RfH(44), height: RfH(155), paddingHorizontal: RfW(16), alignItems: 'flex-start' },
        ]}>
        <IconButtonWrapper
          iconHeight={RfH(24)}
          iconWidth={RfW(24)}
          iconImage={Images.arrowRight}
          submitFunction={() => onBackPress()}
        />
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.rectangle} />
          <IconButtonWrapper
            iconWidth={RfW(16)}
            iconHeight={RfH(16)}
            iconImage={Images.heart}
            styling={{ marginHorizontal: RfW(16) }}
          />
          <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.share} />
        </View>
      </View>
      <IconButtonWrapper
        iconWidth={RfW(128)}
        iconHeight={RfH(128)}
        iconImage={Images.kushal}
        imageResizeMode="cover"
        styling={{ alignSelf: 'center', marginTop: RfH(-64), borderRadius: RfW(64) }}
      />
      <Text style={[styles.tutorName, { alignSelf: 'center', marginTop: RfH(12) }]}>Gurbani Singh</Text>
      <Text style={[styles.tutorDetails, { alignSelf: 'center' }]}>GURUQT133567</Text>
      <Text style={[styles.tutorDetails, { alignSelf: 'center' }]}>3 years of Teaching Experience </Text>
      <View
        style={{
          borderBottomColor: Colors.darkGrey,
          borderBottomWidth: 0.5,
          marginTop: RfH(16),
          borderTopWidth: 0.5,
          borderTopColor: Colors.darkGrey,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 0.5, borderRightWidth: 0.5, borderRightColor: Colors.darkGrey, paddingVertical: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenCenterView}>
            <IconButtonWrapper
              iconHeight={RfH(18)}
              iconWidth={RfW(11)}
              iconImage={Images.single_user}
              styling={{ alignSelf: 'center' }}
            />
            <Text style={styles.typeItemText}>Individual Class</Text>
          </View>
          <View style={commonStyles.horizontalChildrenCenterView}>
            <IconButtonWrapper
              iconHeight={RfH(16)}
              iconWidth={RfW(21)}
              iconImage={Images.multiple_user}
              styling={{ alignSelf: 'center' }}
            />
            <Text style={styles.typeItemText}>Group Class</Text>
          </View>
          <View style={commonStyles.horizontalChildrenCenterView}>
            <IconButtonWrapper
              iconHeight={RfH(16)}
              iconWidth={RfW(18)}
              iconImage={Images.user_board}
              styling={{ alignSelf: 'center' }}
            />
            <Text style={styles.typeItemText}>Demo Class</Text>
          </View>
        </View>
        <View style={{ flex: 0.5, paddingVertical: RfH(16) }}>
          <View style={commonStyles.horizontalChildrenCenterView}>
            <IconButtonWrapper
              iconHeight={RfH(18)}
              iconWidth={RfW(11)}
              iconImage={Images.single_user}
              styling={{ alignSelf: 'center' }}
            />
            <Text style={styles.typeItemText}>Online Class</Text>
          </View>
          <View style={commonStyles.horizontalChildrenCenterView}>
            <IconButtonWrapper
              iconHeight={RfH(18)}
              iconWidth={RfW(11)}
              iconImage={Images.multiple_user}
              styling={{ alignSelf: 'center' }}
            />
            <Text style={styles.typeItemText}>Home Tution</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>
        Educational Qualification
      </Text>
      <Text style={[styles.tutorDetails, { marginHorizontal: RfW(16), marginTop: RfH(10) }]}>Mass Communication</Text>
      <View
        style={{
          borderBottomColor: Colors.darkGrey,
          borderBottomWidth: 0.5,
          marginTop: RfH(16),
          borderTopWidth: 0.5,
          borderTopColor: Colors.darkGrey,
          flexDirection: 'row',
        }}
      />
    </View>
  );
}

export default tutorDetails;
