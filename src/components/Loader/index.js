import React from 'react';
import { Modal, Platform, View } from 'react-native';
import PropTypes from 'prop-types';

import LottieView from 'lottie-react-native';
import styles from './style';
import { RfW } from '../../utils/helpers';
import { LOTTIE_JSON_FILES } from '../../utils/constants';

function Loader(props) {
  const { isLoading, text } = props;
  return (
    <>
      {isLoading ? (
        <>
          {Platform.OS === 'ios' ? (
            <View style={[styles.modalBackground, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
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
              {/* <View style={[styles.activityIndicatorWrapper]}> */}
              {/*  <ActivityIndicator size="large" color={Colors.backgroundYellow} /> */}
              {/*  <Text style={styles.title}>{text}</Text> */}
              {/* </View> */}
            </View>
          ) : (
            <Modal visible={isLoading} animationType="fade" backdropOpacity={1} transparent>
              <View style={[styles.modalBackground, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
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
                {/*  <View style={[styles.activityIndicatorWrapper]}> */}
                {/* <ActivityIndicator size="large" color={Colors.backgroundYellow} /> */}
                {/* <Text style={styles.title}>{text}</Text> */}
                {/*  </View> */}
              </View>
            </Modal>
          )}
        </>
      ) : null}
    </>
  );
}

Loader.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string,
};

Loader.defaultProps = {
  isLoading: false,
  text: 'Please wait ...',
};

export default Loader;
