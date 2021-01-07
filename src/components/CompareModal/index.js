/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import { Colors, Images } from '../../theme';
import { getFullName, getSaveData, getUserImageUrl, RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';
import routeNames from '../../routes/screenNames';
import commonStyles from '../../theme/styles';
import styles from '../../containers/student/tutorListing/styles';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';

const compareModal = (props) => {
  const navigation = useNavigation();
  const { visible, onClose, removeFromCompare } = props;
  const [tutorData, setTutorData] = useState([]);

  const checkCompare = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    setTutorData(compareArray);
  };

  useEffect(() => {
    checkCompare();
  }, []);

  const goToCompareView = () => {
    onClose();
    navigation.navigate(routeNames.STUDENT.COMPARE_TUTORS);
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const renderTutorView = (item, index) => {
    return (
      <View>
        {item && (
          <IconButtonWrapper
            iconWidth={RfH(20)}
            iconHeight={RfH(20)}
            iconImage={Images.cross}
            styling={styles.crossIcon}
            imageResizeMode="contain"
            submitFunction={() => removeFromCompare(index)}
          />
        )}
        {item ? (
          <IconButtonWrapper
            iconWidth={RfH(64)}
            iconHeight={RfH(64)}
            iconImage={getTutorImage(item)}
            imageResizeMode="cover"
            styling={{ alignSelf: 'center', borderRadius: RfH(64) }}
          />
        ) : (
          <IconButtonWrapper
            iconWidth={RfH(70)}
            iconHeight={RfH(70)}
            iconImage={Images.profile}
            imageResizeMode="contain"
            styling={{ alignSelf: 'center', borderRadius: RfH(12), marginTop: RfH(48) }}
          />
        )}
        <Text style={styles.compareTutorName}>{getFullName(item?.contactDetail)}</Text>
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent backdropOpacity={1} visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column' }} />
      <View
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
          opacity: 1,
          paddingBottom: RfH(34),
        }}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            { paddingHorizontal: RfW(16), paddingVertical: RfH(16), backgroundColor: Colors.lightBlue },
          ]}>
          <Text style={commonStyles.headingPrimaryText}>Compare Tutors</Text>
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            styling={{ alignSelf: 'flex-end' }}
            iconImage={Images.cross}
            submitFunction={onClose}
          />
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16), paddingHorizontal: RfW(16) }]}>
          <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[0], 0)}</View>
          <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[1], 1)}</View>
        </View>
        {tutorData.length === 2 && (
          <View
            style={{
              marginTop: RfH(24),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button style={commonStyles.buttonPrimary} block onPress={goToCompareView}>
              <Text style={commonStyles.textButtonPrimary}>Compare</Text>
            </Button>
          </View>
        )}
      </View>
    </Modal>
  );
};

compareModal.defaultProps = {
  visible: false,
  onClose: null,
  removeFromCompare: null,
};

compareModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  removeFromCompare: PropTypes.func,
};

export default compareModal;
