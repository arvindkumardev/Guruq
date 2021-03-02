import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import { getToken, RfW } from '../../../utils/helpers';
import { Images } from '../../../theme';
import ActionModal from '../../certficationProcess/components/helpSection';
import { urlConfig } from '../../../utils/constants';
import Loader from '../../../components/Loader';

const ProficiencyTest = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const offeringId = route?.params?.offeringId;
  const [openMenu, setOpenMenu] = useState(false);

  const [token, setToken] = useState();
  const [url, setUrl] = useState('');
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=375, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (token) {
      setUrl(`${urlConfig.DASHBOARD_URL}/tutor-proficiency-test/${offeringId}/start/${token}`);
    }
  }, [token]);

  const onNavigationStateChange = (event) => {
    if (event.url.includes(`${urlConfig.DASHBOARD_URL}/tutor/start-proficiency-test/${offeringId}/complete`)) {
      navigation.goBack();
    } else {
      console.log('url', event.url);
    }
  };

  return (
    <>
      <ScreenHeader
        label="Proficiency Test"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
      />
      <Loader isLoading={isLoading} />
      <WebView
        source={{ uri: url }}
        javaScriptEnabled
        domStorageEnabled
        renderError={() => setError(true)}
        // renderLoading={() => <InPlaceLoader isLoading />}
        showsVerticalScrollIndicator={false}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        // startInLoadingState
        onNavigationStateChange={(event) => onNavigationStateChange(event)}
      />
      {isError && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
        </View>
      )}
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} navigation={navigation} />}
    </>
  );
};

export default ProficiencyTest;
