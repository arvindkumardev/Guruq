import { Image, Text, View } from 'react-native';
import React from 'react';
import { Button } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Images, Colors } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import styles from './styles';

function compareTutors() {
  const renderTutorView = (item) => {
    return (
      <View style={commonStyles.verticallyStretchedItemsView}>
        <IconButtonWrapper
          iconWidth={RfW(18)}
          iconHeight={RfH(18)}
          iconImage={Images.cross}
          styling={styles.crossIcon}
        />
        <IconButtonWrapper
          iconWidth={RfW(70)}
          iconHeight={RfH(70)}
          iconImage={Images.kushal}
          styling={{ alignSelf: 'center', borderRadius: RfH(12) }}
        />
        <Text style={styles.compareTutorName}>Ketan Shiwani</Text>
        <Text style={{ color: Colors.darkGrey, alignSelf: 'center' }}>₹ 350/ hour</Text>
        <View style={[commonStyles.horizontalChildrenCenterView, { marginTop: RfH(8) }]}>
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.user_board} />
          <IconButtonWrapper
            iconHeight={RfH(18)}
            iconWidth={RfW(18)}
            iconImage={Images.heart}
            styling={{ marginHorizontal: RfW(16) }}
          />
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.share} />
        </View>
        <Button block bordered style={{ marginHorizontal: RfW(16), marginTop: RfH(24) }}>
          <Text style={{ color: Colors.brandBlue2 }}>Book Class</Text>
        </Button>
      </View>
    );
  };

  const renderBasicInfoView = () => {
    return (
      <View style={styles.informationParentMargin}>
        <Text style={styles.switchText}>Basic Information</Text>
        <Text style={[styles.infoCategoryText, { marginTop: RfH(16) }]}>User Reviews</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.horizontalChildrenView}>
            <Text>3.0</Text>
            <IconButtonWrapper
              iconWidth={RfW(76)}
              iconHeight={RfH(13)}
              iconImage={Images.four_stars}
              styling={{ marginHorizontal: RfH(6) }}
            />
            <IconButtonWrapper
              iconWidth={RfW(13)}
              iconHeight={RfH(13)}
              iconImage={Images.grey_star}
              styling={{ alignSelf: 'center' }}
            />
          </View>
          <View style={commonStyles.horizontalChildrenView}>
            <IconButtonWrapper
              iconWidth={RfW(13)}
              iconHeight={RfH(13)}
              iconImage={Images.grey_star}
              styling={{ alignSelf: 'center' }}
            />
            <IconButtonWrapper
              iconWidth={RfW(76)}
              iconHeight={RfH(13)}
              iconImage={Images.four_stars}
              styling={{ marginHorizontal: RfH(6) }}
            />
            <Text>4.0</Text>
          </View>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.ratingText}>130 reviews</Text>
          <Text style={styles.ratingText}>130 reviews</Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Qualification</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.qualificationItemText}>Diploma ( automobile engineering)</Text>
          <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>Higher Secondary (Commerce Stream)</Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Experience</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.qualificationItemText}>3.5 Years</Text>
          <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>4.5 Years</Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Mode of Tution</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.laptop}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Online</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.home}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Offline</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.laptop}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Online</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.home}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Offline</Text>
            </View>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Type</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.single_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Individual</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.multiple_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Group</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.single_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Individual</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.multiple_user}
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Group</Text>
            </View>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
      </View>
    );
  };
  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <ScreenHeader label="Compare Tutors" horizontalPadding={16} lineVisible homeIcon />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8), paddingHorizontal: RfW(16) }]}>
        <View style={{ flex: 0.5 }}>{renderTutorView()}</View>
        <View style={{ flex: 0.5 }}>{renderTutorView()}</View>
      </View>
      <View>{renderBasicInfoView()}</View>
    </View>
  );
}

export default compareTutors;
