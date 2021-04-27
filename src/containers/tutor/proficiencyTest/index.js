import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import ScreenHeader from '../../../components/ScreenHeader';
import { getToken, RfW } from '../../../utils/helpers';
import { Images } from '../../../theme';
import ActionModal from '../../certficationProcess/components/helpSection';
import { urlConfig } from '../../../utils/constants';
import PTTestView from '../../../components/PTTest';
import {START_PROFICIENCY_TEST,CHECK_PT_RESPONSE} from './pt.mutation'
import NavigationRouteNames from '../../../routes/screenNames';
const ProficiencyTest = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const offeringId = route?.params?.offeringId;
  const [openMenu, setOpenMenu] = useState(false);
  const [token, setToken] = useState();
  const [url, setUrl] = useState('');
  const [isError, setError] = useState(false);
  const [ptQuestions,setPTQuestions]=useState([]);
  const [ptDetails,setPTDetails]=useState(null);
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=375, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;



  useEffect(() => {
    if (token) {
      setUrl(`${urlConfig.DASHBOARD_URL}/tutor-proficiency-test/${offeringId}/start/${token}`);
    }
  }, [token]);


  

  const [startPTRequest, { loading: startPTLoading }] = useMutation(START_PROFICIENCY_TEST, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log({ e });
      // history.push('/');
    },
    onCompleted(data) {
      if (data?.startProficiencyTest) {
        const { tutorOffering, tutorPT, questions } = data.startProficiencyTest;
          setPTQuestions(questions)
          setPTDetails(tutorPT)
      }
    },
  });

  const [checkPTRequest, { loading: checkPTLoading }] = useMutation(CHECK_PT_RESPONSE, {
    fetchPolicy: 'no-cache',

    onError(e) {
      console.log({ e });
    },
    onCompleted(data) {
      
      navigation.navigate(NavigationRouteNames.TUTOR.PROFICIENCY_RESULT, {
        data,
      });
      
    },
  });
  const handleSubmit=(checkPTDto)=>{
    checkPTRequest({ variables: { tutorOfferingId: parseInt(offeringId), checkPTDto } });
  }


  useEffect(() => {
    if (offeringId > 0) {
      startPTRequest({
        variables: {
          tutorOfferingId: parseInt(offeringId),
        },
      });
    }
  }, [offeringId]);

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
   
   {ptQuestions.length>0&&ptDetails!=null?  
   <PTTestView
      ptQuestions={ptQuestions}
        ptDetails={ptDetails}
        offeringId={offeringId}
        handleSubmit={handleSubmit}
      >
   </PTTestView>:null} 

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
