/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { IconButtonWrapper } from '../../../../components';
import NavigationRouteNames from '../../../../routes/screenNames';

const SubjectsModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose, onSelect, subjects } = props;

  const gotoTutors = (subject) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const renderItem = (item) => {
    return (
      <View style={{ marginTop: RfH(20), flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => gotoTutors(item)}
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                item.id % 4 === 0
                  ? '#E7E5F2'
                  : item.id % 4 === 1
                  ? '#FFF7F0'
                  : item.id % 4 === 2
                  ? 'rgb(230,252,231)'
                  : 'rgb(203,231,255)',
              height: RfH(67),
              width: RfW(70),
              borderRadius: RfW(8),
            }}>
            <IconButtonWrapper
              iconWidth={RfW(24.5)}
              styling={{ alignSelf: 'center' }}
              iconHeight={RfH(34.2)}
              iconImage={Images.book}
            />
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              width: RfW(70),
              color: Colors.primaryText,
              marginTop: RfH(5),
            }}>
            {item.displayName}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
        <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            paddingHorizontal: RfW(16),
          }}>
          {/* <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={4}
            data={subjects}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

SubjectsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  subjects: PropTypes.array,
};

export default SubjectsModal;
