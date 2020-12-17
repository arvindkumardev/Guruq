import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { getToken } from '../../utils/helpers';
import { ScreenHeader } from '../index';

const WebViewPage = (props) => {
  const { route } = props;

  const url = route?.params?.url;
  const label = route?.params?.label;

  const [token, setToken] = useState();
  const [injectJS, setInjectJS] = useState('');

  // useEffect(() => {
  //   getToken().then((tk) => setToken(tk));
  // });

  useEffect(() => {
    getToken().then((tk) => {
      setInjectJS(`(function(){     
        window.localStorage.setItem('authToken', '${tk}');
        window.location = '${url}/${token}';})();`);
      setToken(tk);
    });
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
          source={{ uri: `http://dashboardv2.guruq.in/embed.html` }}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScript={injectJS}
          onMessage={onMessage}
        />
      )}
    </>
  );
};

export default WebViewPage;
