import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import InPlaceLoader from '../InPlaceLoader';
import { ScreenHeader } from '../index';

function CustomModalWebView(props) {
  const {
    headerText,
    url,
    backButtonHandler,
    modalVisible,
    onNavigationStateChange,
    showLoader,
    isBackAllowed,
  } = props;
  const [isError, setError] = useState(false);
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      backdropOpacity={1}
      transparent
      onRequestClose={isBackAllowed ? backButtonHandler : null}>
      <ScreenHeader label={headerText} homeIcon={isBackAllowed} horizontalPadding={16} handleBack={backButtonHandler} />
      <WebView
        cacheEnabled={false}
        domStorageEnabled
        javaScriptEnabled
        onNavigationStateChange={onNavigationStateChange}
        renderError={() => setError(true)}
        renderLoading={() => (showLoader ? <InPlaceLoader isLoading text="Please wait..." /> : null)}
        source={{ uri: url }}
        startInLoadingState
      />
      {isError && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
        </View>
      )}
    </Modal>
  );
}

CustomModalWebView.propTypes = {
  headerText: PropTypes.string,
  url: PropTypes.string,
  backButtonHandler: PropTypes.func,
  modalVisible: PropTypes.bool,
  onNavigationStateChange: PropTypes.func,
  showLoader: PropTypes.bool,
  isBackAllowed: PropTypes.bool,
};

CustomModalWebView.defaultProps = {
  headerText: '',
  url: '',
  modalVisible: false,
  showLoader: true,
  backButtonHandler: null,
  isBackAllowed: true,
};

export default CustomModalWebView;
