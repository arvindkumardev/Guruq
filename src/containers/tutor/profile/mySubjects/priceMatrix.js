import { Image, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import styles from './styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors } from '../../../../theme';
import PriceMatrixView from './components/priceMatrixView';
import WhyMeView from './components/whyMeView';
import Loader from '../../../../components/Loader';

function PriceMatrix(props) {
  const [isPriceMatrix, setIsPriceMatrix] = useState(true);
  const [isWhyMe, setIsWhyMe] = useState(false);
  const { route } = props;

  const offering = route?.params?.offering;

  const onPriceMatrixClicked = () => {
    setIsPriceMatrix(true);
    setIsWhyMe(false);
  };
  const onWhyMeClicked = () => {
    setIsPriceMatrix(false);
    setIsWhyMe(true);
  };

  const showLoader = (loading) => {
    return loading;
  };

  return (
    <View style={{ paddingHorizontal: RfW(16), backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={showLoader()} />
      <ScreenHeader homeIcon />
      <View>
        <View style={[commonStyles.horizontalChildrenCenterView]}>
          <Button
            small
            block
            bordered
            onPress={() => onPriceMatrixClicked()}
            style={isWhyMe ? styles.inactiveLeftButton : styles.activeLeftButton}>
            <Text style={isWhyMe ? styles.inactiveButtonText : styles.activeButtonText}>Price Matrix</Text>
          </Button>
          <Button
            small
            block
            bordered
            onPress={() => onWhyMeClicked()}
            style={isWhyMe ? styles.activeRightButton : styles.inactiveRightButton}>
            <Text style={isWhyMe ? styles.activeButtonText : styles.inactiveButtonText}>Why Me</Text>
          </Button>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {isPriceMatrix && <PriceMatrixView selectedOffering={offering} showLoader={() => showLoader()} />}
        {isWhyMe && <WhyMeView selectedOffering={offering} showLoader={() => showLoader()} />}
      </View>
    </View>
  );
}

export default PriceMatrix;
