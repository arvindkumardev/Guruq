import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { ScreenHeader } from '../../../components';
import { getToken, RfW } from '../../../utils/helpers';

// const url = 'http://dashboardv2.guruq.in/tutor/embed/on-boarding';
const url = 'http://10.0.0.9:3000/tutor/embed/on-boarding';

const CertificationProcessView = (props) => {
  const [token, setToken] = useState();
  const [injectJS, setInjectJS] = useState('');

  useEffect(() => {
    getToken().then((tk) => {
      //   const myInjectedJs = `(function(){ let tk = window.localStorage.getItem('authToken');
      //   if(!tk || (tk && tk != '${token}')){
      //     window.localStorage.setItem('authToken', '${token}');
      //     window.location.reload();
      //   }
      // })();`;

      //   setInjectJS(myInjectedJs);

      console.log('token ', tk);

      setToken(tk);
    });
  });

  const onMessage = (payload) => {
    console.log('payload', payload);
  };
  console.log(url, token);

  return (
    <>
      <ScreenHeader label="Certification Process" homeIcon={false} horizontalPadding={RfW(16)} />

      {token && (
        <WebView
          source={{ uri: `${url}/${token}` }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={onMessage}
          // injectedJavaScript={injectJS}
        />
      )}
    </>
  );
};

CertificationProcessView.propTypes = {};

export default CertificationProcessView;
