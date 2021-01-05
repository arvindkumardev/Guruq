import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import { getToken, RfW } from '../../../utils/helpers';

const ProficiencyTest = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const offeringId = route?.params?.offeringId;

  const [token, setToken] = useState();
  const [url, setUrl] = useState('');

  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=375, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  useEffect(() => {
    if (token) {
      setUrl(`http://dashboardv2.guruq.in/tutor/embed/tutor-proficiency-test/${offeringId}/start/${token}`);
    }
  }, [token]);

  const onNavigationStateChange = (event) => {
    if (event.url.includes(`http://dashboardv2.guruq.in/tutor/start-proficiency-test/${offeringId}/complete`)) {
      navigation.goBack();
    } else {
      console.log('url', event.url);
    }
  };

  return (
    <>
      <ScreenHeader label="Proficiency Test" homeIcon horizontalPadding={RfW(16)} />
      {token && url ? (
        <WebView
          source={{
            uri: url,
          }}
          javaScriptEnabled
          domStorageEnabled
          showsVerticalScrollIndicator={false}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          onNavigationStateChange={onNavigationStateChange}
        />
      ) : (
        <Text>Something Went Wrong</Text>
      )}
    </>
  );
};

export default ProficiencyTest;
