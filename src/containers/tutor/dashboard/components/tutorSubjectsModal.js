/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IconButtonWrapper } from '../../../../components';
import { Colors, Fonts, Images } from '../../../../theme';
import { getBoxColor } from '../../../../theme/colors';
import commonStyles from '../../../../theme/styles';
import { getSubjectIcons, RfH, RfW } from '../../../../utils/helpers';

const TutorSubjectsModal = (props) => {
  const { visible, onClose, subjects } = props;

  const renderItem = (item) => {
    return (
      <View
        style={{
          marginTop: RfH(20),
          flex: 1,
          backgroundColor: getBoxColor(item?.offering?.displayName),
          marginHorizontal: RfW(8),
          padding: RfH(8),
        }}>
        <TouchableWithoutFeedback
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
          }}>
          <IconButtonWrapper
            iconWidth={RfW(48)}
            iconHeight={RfH(56)}
            styling={{ alignSelf: 'flex-start' }}
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
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
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
          }}>
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              { backgroundColor: Colors.lightBlue, paddingHorizontal: RfW(16) },
            ]}>
            <Text style={commonStyles.headingPrimaryText}>All Subjects</Text>
            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
              iconImage={Images.cross}
              submitFunction={onClose}
            />
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            data={subjects}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(34), paddingHorizontal: RfH(16) }}
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
