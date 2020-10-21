import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import LottieView from 'lottie-react-native';
import styles from './style';
import { RfW } from '../../utils/helpers';
import { LOTTIE_JSON_FILES } from '../../utils/constants';

function InPlaceLoader(props) {
  const { isLoading, text } = props;
  return (
    <>
      {isLoading
        ? (
          <View
            style={[
              styles.modalBackground,
              { backgroundColor: 'rgba(0,0,0,0.1)' },
            ]}
          >
            <LottieView
              style={{
                height: RfW(80),
                width: RfW(80),
                alignSelf: 'center',
              }}
              source={LOTTIE_JSON_FILES.loaderJson}
              resizeMode="contain"
              loop
              autoPlay
            />
          </View>
        )
        : null}
    </>
  );
}

InPlaceLoader.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string,
};

InPlaceLoader.defaultProps = {
  isLoading: false,
  text: 'Please wait ...',
};

export default InPlaceLoader;
