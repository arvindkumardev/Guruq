import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getFileUrl, RfH, RfW } from '../../utils/helpers';
import styles from '../../containers/student/pytn/styles';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import CustomImage from '../CustomImage';

const TutorImageComponent = (props) => {
  const { styling, width, height, tutor, fontSize } = props;

  const getInitials = () => {
    const firstInitial = tutor?.contactDetail.firstName ? tutor?.contactDetail.firstName[0].toUpperCase() : '';
    const lastInitial = tutor?.contactDetail.lastName ? tutor?.contactDetail.lastName[0].toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  return (
    <>
      {tutor?.profileImage?.filename ? (
        <CustomImage
          imageWidth={RfW(width)}
          imageHeight={RfH(height)}
          image={getFileUrl(tutor?.profileImage?.filename)}
          imageResizeMode="cover"
          styling={styling}
        />
      ) : (
        <View
          style={{
            height: RfH(height),
            width: RfW(width),
            ...styling,
            backgroundColor: Colors.lightPurple,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[commonStyles.headingPrimaryText, { fontSize: RFValue(fontSize, STANDARD_SCREEN_SIZE) }]}>
            {getInitials()}
          </Text>
        </View>
      )}
    </>
  );
};

TutorImageComponent.defaultProps = {
  styling: styles.userIcon,
  width: 24,
  height: 24,
  tutor: {},
  fontSize: 40,
};

TutorImageComponent.propTypes = {
  styling: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  tutor: PropTypes.object,
  fontSize: PropTypes.number,
};

export default TutorImageComponent;
