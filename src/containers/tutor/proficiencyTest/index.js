import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import { getToken, RfW } from '../../../utils/helpers';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors,Fonts,Images } from '../../../theme';
import ActionModal from '../../certficationProcess/components/helpSection';

const ProficiencyTest = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const offeringId = route?.params?.offeringId;
  const [openMenu, setOpenMenu] = useState(false);

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
      <ScreenHeader label="Proficiency Test" 
       showRightIcon
       rightIcon={Images.vertical_dots_b}
       onRightIconClick={() => setOpenMenu(true)}
      homeIcon horizontalPadding={RfW(16)} />
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
        {
        openMenu && <ActionModal
          isVisible={openMenu}
          closeMenu={() => setOpenMenu(false)}
          navigation={navigation}
        />
      }
    </>
    
  );
};

export default ProficiencyTest;
