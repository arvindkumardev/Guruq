import { Image, StatusBar, Text, View } from 'react-native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../common/styles';
import { Colors, Images } from '../../../theme';
import { getSaveData, RfH, RfW } from '../../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import styles from './style';

function studentTutorSelector() {
  const [userName, setUserName] = useState('Sheena');
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // getFirstName();
  });

  const getFirstName = async () => {
    const firstname = await getSaveData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME);
    setUserName(firstname);
  };

  return (
    <View style={commonStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.helloView}>
        <Icon
          onPress={() => onBackPress()}
          type="MaterialIcons"
          name="keyboard-backspace"
          style={{ color: Colors.darktitle }}
        />
        <Text style={{ marginLeft: RfW(8), fontSize: 16, color: Colors.inputLabel }}>Hello</Text>
      </View>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.subHeading}>Continue as</Text>
      <View>
        <Image style={{ alignSelf: 'center', marginTop: 16 }} source={Images.student} />
      </View>
      <Text style={[styles.subHeading, { marginTop: RfH(34) }]}>Student</Text>
      <View>
        <Image style={{ alignSelf: 'center', marginTop: 12 }} source={Images.tutor} />
      </View>
      <Text style={[styles.subHeading, { marginTop: RfH(34) }]}>Tutor</Text>
    </View>
  );
}

export default studentTutorSelector;
