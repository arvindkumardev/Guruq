import { View } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';
import { ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { RfW } from '../../../utils/helpers';

function WebViewPages(props) {
  const { route } = props;

  const url = route?.params?.url;
  const label = route?.params?.label;
  return (
    <View style={commonStyles.mainContainer}>
      <ScreenHeader label={label} horizontalPadding={RfW(16)} />
      <WebView source={{ uri: url }} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

export default WebViewPages;
