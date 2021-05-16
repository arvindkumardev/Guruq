import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../styles';
import { IconButtonWrapper } from '../../../../components';
import { Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

const LabelComponent = ({ id, label, onPress }) => {
  const handlePress = () => {
    onPress(id);
  };
  return (
    <Pressable style={styles.labelmainview} onPress={handlePress}>
      <Text style={styles.labeltextview}>{label}</Text>
      <View style={styles.labeliconstyle}>
        <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.chevronRight} />
      </View>
    </Pressable>
  );
};

export default React.memo(LabelComponent);
