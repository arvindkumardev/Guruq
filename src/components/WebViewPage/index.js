import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { getToken, RfW } from '../../utils/helpers';
import { ScreenHeader } from '../index';
import InPlaceLoader from '../InPlaceLoader';

const WebViewPage = (props) => {
  const { route } = props;

  const url = route?.params?.url;
  const label = route?.params?.label;

  const [token, setToken] = useState();
  const [injectJS, setInjectJS] = useState('');

  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=375, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
  // useEffect(() => {
  //   getToken().then((tk) => setToken(tk));
  // });

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  });

  const onMessage = (payload) => {
    console.log('payload', payload);
  };
  console.log(url, token);

  return (
    <>
      <ScreenHeader label={label} homeIcon horizontalPadding={RfW(16)} />
      {token && url && (
        <WebView
          source={{ uri: `${url}` }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={onMessage}
          renderLoading={() => <InPlaceLoader isLoading text="Please wait..." />}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          startInLoadingState
        />
      )}
    </>
  );
};

export default WebViewPage;
