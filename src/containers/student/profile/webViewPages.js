import { Image, Text, View } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';
import { ScreenHeader } from '../../../components';
import { RfW } from '../../../utils/helpers';

function WebViewPages(props) {
  const { route } = props;

  const url = route?.params?.url;
  const label = route?.params?.label;
  return (
    <View>
      <ScreenHeader label={label} homeIcon horizontalPadding={RfW(16)} />
      <WebView source={{ uri: url }} />
    </View>
  );
}

export default WebViewPages;
