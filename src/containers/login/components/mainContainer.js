import { Keyboard, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import PropTypes from 'prop-types';
import commonStyles from '../../../common/styles';
import Colors from '../../../theme/colors';
import styles from '../styles';
import Loader from '../../../components/Loader';

function MainContainer(props) {
  const { isLoading, onBackPress } = props;

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.onboardBackground }]}>
      <Loader isLoading={isLoading} />
      <StatusBar barStyle="light-content" />
      <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={styles.backIcon} />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>{props.children}</View>
      </KeyboardAvoidingView>
    </View>
  );
}

MainContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onBackPress: PropTypes.func.isRequired,
};

export default MainContainer;
