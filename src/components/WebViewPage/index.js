import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { ScreenHeader } from '../index';
import { getToken } from '../../utils/helpers';

const WebViewPages = (props) => {
  const { route } = props;

  const url = route?.params?.url;
  const label = route?.params?.label;

  const [token, setToken] = useState();

  useEffect(() => {
    getToken().then((tk) => setToken(tk));
  });

  const onMessage = (payload) => {
    console.log('payload', payload);
  };
  console.log(url, label, token);

  return (
    <>
      <ScreenHeader label={label} homeIcon />
      {token && (
        <WebView
          source={{ uri: `${url}/${token}` }}
          javaScriptEnabled
          domStorageEnabled
          // injectedJavaScript={INJECTED_JAVASCRIPT}
          onMessage={onMessage}
        />
      )}
    </>
  );
};

export default WebViewPages;
