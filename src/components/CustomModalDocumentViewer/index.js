import React, { useState } from 'react';
import { Modal, Share, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import { useReactiveVar } from '@apollo/client';
import { Images } from '../../theme';
import style from './style';
import InPlaceLoader from '../InPlaceLoader';
import { ScreenHeader } from '../index';
import { getDocumentFileUrl } from '../../utils/helpers';
import { userToken } from '../../apollo/cache';

function CustomModalDocumentViewer(props) {
  const { document, backButtonHandler, modalVisible } = props;

  const userTokenVal = useReactiveVar(userToken);

  const [isError, setIsError] = useState(false);
  const source = { uri: getDocumentFileUrl(document.attachment.original, userTokenVal), cache: false };

  const handleShare = async () => {
    await Share.share({
      title: document.name,
      url: source.uri,
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slideIn"
      backdropOpacity={1}
      // transparent
      onRequestClose={backButtonHandler}>
      <ScreenHeader
        label={document.name}
        horizontalPadding={16}
        handleBack={backButtonHandler}
        homeIcon
        showRightIcon
        rightIcon={Images.share}
        onRightIconClick={handleShare}
      />
      {!isError && (
        <>
          {document.attachment.type === 'application/pdf' ? (
            <Pdf
              source={source}
              onError={(error) => {
                setIsError(true);
              }}
              activityIndicator={<InPlaceLoader isLoading />}
              style={style.pdf}
            />
          ) : (
            <WebView
              cacheEnabled={false}
              domStorageEnabled
              javaScriptEnabled
              renderError={() => setIsError(true)}
              renderLoading={() => <InPlaceLoader isLoading text="Please wait..." />}
              source={source}
              startInLoadingState
            />
          )}
        </>
      )}

      {isError && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
        </View>
      )}
    </Modal>
  );
}

CustomModalDocumentViewer.propTypes = {
  headerText: PropTypes.string,
  document: PropTypes.object,
  backButtonHandler: PropTypes.func,
  modalVisible: PropTypes.bool,
  isRightButtonVisible: PropTypes.bool,
  handleShare: PropTypes.func,
};

CustomModalDocumentViewer.defaultProps = {
  headerText: '',
  document: {},
  modalVisible: false,
  isRightButtonVisible: false,
  handleShare: null,
};

export default CustomModalDocumentViewer;
