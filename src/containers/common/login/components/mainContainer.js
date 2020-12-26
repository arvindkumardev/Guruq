import { Keyboard, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import PropTypes from 'prop-types';
import commonStyles from '../../../../theme/styles';
import Colors from '../../../../theme/colors';
import styles from '../styles';
import Loader from '../../../../components/Loader';
import { RfH, RfW } from '../../../../utils/helpers';

function MainContainer(props) {
  const { isLoading, onBackPress, isBackButtonVisible } = props;

  return (
    <>
      <Loader isLoading={isLoading} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            commonStyles.mainContainer,
            { paddingTop: RfH(44), paddingHorizontal: 0, backgroundColor: Colors.brandBlue },
          ]}>
          <StatusBar barStyle="light-content" />
          {isBackButtonVisible && (
            <View style={{ paddingHorizontal: RfW(16), width: '20%' }}>
              <Icon onPress={onBackPress} type="MaterialIcons" name="keyboard-backspace" style={styles.backIcon} />
            </View>
          )}
          <View style={{ flex: 1 }} />

          <KeyboardAvoidingView behavior="padding">
            <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>{props.children}</View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

MainContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onBackPress: PropTypes.func.isRequired,
  isBackButtonVisible: PropTypes.bool,
};

MainContainer.defaultProps = {
  isBackButtonVisible: true,
};

export default MainContainer;
