import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const Whiteboard = (props) => {
  const { uuid } = props;
  return (
    <WebView
      source={{
        uri: `https://staging.guruq.in/boards/bid/${uuid}`,
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

Whiteboard.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default Whiteboard;
