import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { Colors, Images } from '../../theme';
import LoginCheck from '../common/login/loginCheck';
import { GET_OFFERINGS_MASTER_DATA } from '../student/dashboard-query';
import { offeringsMasterData } from '../../apollo/cache';
import { deviceHeight, deviceWidth } from '../../utils/helpers';

function SplashScreen() {
  const [getOfferingMasterData] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        offeringsMasterData(data.offerings.edges);
      }
    },
  });

  useEffect(() => {
    getOfferingMasterData();
  }, []);

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { alignItems: 'center', paddingHorizontal: 0, backgroundColor: Colors.brandBlue },
      ]}>
      <LoginCheck />
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{ width: deviceWidth(), height: deviceHeight() }}
          source={Images.splashScreen1}
          resizeMode="contain"
        />
        {/* <Text style={styles.msgOne}>India's Best</Text> */}
        {/* <Text style={styles.msgTwo}>Tutoring Platform</Text> */}
      </View>
      {/* <Text style={styles.bottomMsg}>Powered by RHA Technologies</Text> */}
    </View>
  );
}

export default SplashScreen;
