import { Image, Text } from 'react-native';
import React from 'react';
import { Button, Footer, FooterTab } from 'native-base';
import { Colors, Images } from '../../../../../theme';
import styles from './styles';

function BottomTab(props) {
  const { activeTab, changeTab } = props;
  return (
    <Footer style={{ backgroundColor: Colors.white }}>
      <FooterTab style={{ backgroundColor: Colors.white }}>
        <Button
          style={{ backgroundColor: Colors.white }}
          vertical
          active={activeTab === 1}
          onPress={() => changeTab(1)}>
          <Image
            source={activeTab === 1 ? Images.home_active : Images.home}
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text style={activeTab === 1 ? styles.bottomTabActive : styles.bottomText}>Home</Text>
        </Button>
        <Button
          style={{ backgroundColor: Colors.white }}
          vertical
          active={activeTab === 2}
          onPress={() => changeTab(2)}>
          <Image
            source={activeTab === 2 ? Images.calendar_active : Images.calendar}
            style={styles.iconStyle}
            resizeMode="contain"
          />

          <Text style={activeTab === 2 ? styles.bottomTabActive : styles.bottomText}>Calendar</Text>
        </Button>
        <Button
          style={{ backgroundColor: Colors.white }}
          vertical
          active={activeTab === 3}
          onPress={() => changeTab(3)}>
          <Image
            source={activeTab === 3 ? Images.classes_active : Images.classes}
            style={styles.iconStyle}
            resizeMode="contain"
          />

          <Text style={activeTab === 3 ? styles.bottomTabActive : styles.bottomText}>Classes</Text>
        </Button>
        <Button
          style={{ backgroundColor: Colors.white }}
          vertical
          active={activeTab === 4}
          onPress={() => changeTab(4)}>
          <Image
            source={activeTab === 4 ? Images.wallet_active : Images.wallet}
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text style={activeTab === 4 ? styles.bottomTabActive : styles.bottomText}>Q-Points</Text>
        </Button>
        <Button
          style={{ backgroundColor: Colors.white }}
          vertical
          active={activeTab === 5}
          onPress={() => changeTab(5)}>
          <Image
            source={activeTab === 5 ? Images.profile_active : Images.profile}
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text style={activeTab === 5 ? styles.bottomTabActive : styles.bottomText}>Profile</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
}

export default BottomTab;
