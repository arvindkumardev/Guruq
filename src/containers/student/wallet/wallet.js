/* eslint-disable react/no-typos */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { ScrollView, Text, View } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import PropTypes from 'prop-types';
import commonStyles from '../../../theme/styles';
import { RfH } from '../../../utils/helpers';
import { Colors, Fonts } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { studentDetails } from '../../../apollo/cache';

function Wallet(props) {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);
  const { changeTab } = props;

  const studentInfo = useReactiveVar(studentDetails);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 30) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <View style={{ height: RfH(44), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && <Text style={commonStyles.headingPrimaryText}>My Wallet</Text>}
      </View>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => handleScroll(event)}
          stickyHeaderIndices={[1]}
          scrollEventThrottle={16}>
          <Text style={commonStyles.pageTitleThirdRow}>My Wallet</Text>
          <View style={{ height: 800 }} />
        </ScrollView>
      </View>
    </View>
  );
}

Wallet.propTypes = {
  changeTab: PropTypes.func,
};

Wallet.defaultProps = {
  changeTab: null,
};

export default Wallet;
