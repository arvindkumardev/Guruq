/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Images } from '../../../../theme';
import { getSubjectIcons, RfH, RfW } from '../../../../utils/helpers';
import { IconButtonWrapper } from '../../../../components';
import NavigationRouteNames from '../../../../routes/screenNames';
import { getBoxColor } from '../../../../theme/colors';
import commonStyles from '../../../../theme/styles';

const TutorSubjectsModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose, onSelect, subjects } = props;

  const renderItem = (item) => {
    return (
      <View style={{ marginTop: RfH(20), flex: 1, backgroundColor: getBoxColor(item?.offering?.displayName) }}>
        <TouchableWithoutFeedback
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
          }}>
          <IconButtonWrapper
            iconWidth={RfW(48)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(56)}
            styling={{ aliinSelf: 'flex-start' }}
            iconImage={getSubjectIcons(item?.offering?.displayName)}
          />
          <View style={commonStyles.horizontalChildrenView}>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.semiBold }]}>
              {item?.offerings[2]?.displayName}
            </Text>
            <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.semiBold }]}>
              -{item?.offerings[1]?.displayName}
            </Text>
          </View>
          <Text style={commonStyles.smallMutedText}>{item?.offering?.displayName}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
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
          <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={3}
            data={subjects}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

TutorSubjectsModal.defaultProps = {
  visible: false,
  onClose: null,
  onSelect: null,
  subjects: [],
};

TutorSubjectsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  subjects: PropTypes.array,
};

export default TutorSubjectsModal;
