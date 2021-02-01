import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getProfileImageUrl, getNameInitials, RfH } from '../../utils/helpers';
import styles from '../../containers/student/pytn/styles';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import CustomImage from '../CustomImage';

const TutorImageComponent = (props) => {
  const { styling, width, height, tutor, fontSize } = props;

  return (
    <>
      {tutor && tutor?.profileImage?.original ? (
        <CustomImage
          imageWidth={RfH(width)}
          imageHeight={RfH(height)}
          image={getProfileImageUrl(tutor?.profileImage?.original)}
          imageResizeMode="cover"
          styling={styling}
        />
      ) : (
        <View
          style={{
            height: RfH(height),
            width: RfH(width),
            ...styling,
            backgroundColor: Colors.lightPurple,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[commonStyles.headingPrimaryText, { fontSize: RFValue(fontSize, STANDARD_SCREEN_SIZE) }]}>
            {getNameInitials(tutor.contactDetail)}
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
  fontSize: 24,
};

TutorImageComponent.propTypes = {
  styling: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  tutor: PropTypes.object,
  fontSize: PropTypes.number,
};

export default TutorImageComponent;
