import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useReactiveVar } from '@apollo/client';
import { getNameInitials, RfH } from '../../utils/helpers';
import styles from '../../containers/student/pytn/styles';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import { ATTACHMENT_PREVIEW_URL, STANDARD_SCREEN_SIZE } from '../../utils/constants';
import CustomImage from '../CustomImage';
import { userDetails } from '../../apollo/cache';

const UserImageComponent = (props) => {
  const { styling, width, height, fontSize } = props;
  const userInfo = useReactiveVar(userDetails);
  return (
    <>
      {userInfo?.profileImage?.filename ? (
        <CustomImage
          imageWidth={RfH(width)}
          imageHeight={RfH(height)}
          image={`${ATTACHMENT_PREVIEW_URL}${userInfo?.profileImage?.original}`}
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
            {getNameInitials(userInfo)}
          </Text>
        </View>
      )}
    </>
  );
};

UserImageComponent.defaultProps = {
  styling: styles.userIcon,
  width: 24,
  height: 24,
  fontSize: 24,
};

UserImageComponent.propTypes = {
  styling: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.number,
};

export default UserImageComponent;
