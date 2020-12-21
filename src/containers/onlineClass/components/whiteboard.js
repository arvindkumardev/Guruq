import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { View } from 'native-base';
import { RfH } from '../../../utils/helpers';
import { Colors } from '../../../theme';

const Whiteboard = (props) => {
  const { uuid } = props;
  return (
    <>
      <View style={{ paddingTop: RfH(44), backgroundColor: Colors.white }} />
      <WebView
        source={{
          uri: `https://staging.guruq.in/boards/bid/${uuid}`,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
};

Whiteboard.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default Whiteboard;
