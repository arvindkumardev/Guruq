import { Text, View, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { isDisplayWithNotch, RfH, RfW } from '../../../utils/helpers';
import { Colors } from '../../../theme';
import PriceMatrixView from './components/priceMatrixView';
import WhyMeView from './components/whyMeView';
import Loader from '../../../components/Loader';

function PriceMatrix(props) {
  const [isPriceMatrix, setIsPriceMatrix] = useState(true);
  const { route } = props;

  const offering = route?.params?.offering;
  const onButtonClicked = (val) => {
    setIsPriceMatrix(val);
  };

  const showLoader = (loading) => loading;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'padding' })} enabled>
      <Loader isLoading={showLoader()} />
      <View style={{ paddingHorizontal: RfW(16), backgroundColor: Colors.white, flex: 1 }}>
        <ScreenHeader homeIcon label={offering.offering?.displayName} />
        <View style={{ marginTop: RfH(20) }}>
          <View style={[commonStyles.horizontalChildrenCenterView]}>
            <Button
              small
              block
              bordered
              onPress={() => onButtonClicked(true)}
              style={[styles.leftButton, !isPriceMatrix && { borderColor: Colors.darkGrey }]}>
              <Text
                style={[
                  commonStyles.regularPrimaryText,
                  { color: isPriceMatrix ? Colors.brandBlue : Colors.darkGrey },
                ]}>
                Price Matrix
              </Text>
            </Button>
            <Button
              small
              block
              bordered
              onPress={() => onButtonClicked(false)}
              style={[styles.rightButton, isPriceMatrix && { borderColor: Colors.darkGrey }]}>
              <Text
                style={[
                  commonStyles.regularPrimaryText,
                  { color: !isPriceMatrix ? Colors.brandBlue : Colors.darkGrey },
                ]}>
                Why Me
              </Text>
            </Button>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {isPriceMatrix && <PriceMatrixView offering={offering} showLoader={() => showLoader()} />}
          {!isPriceMatrix && <WhyMeView offering={offering} showLoader={() => showLoader()} />}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PriceMatrix;
