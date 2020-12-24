import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, Text, View, TouchableOpacity } from 'react-native';
import { Colors, Images } from '../../theme';
import { getSubjectIcons, RfH, RfW } from '../../utils/helpers';
import IconButtonWrapper from '../IconWrapper';
import commonStyles from '../../theme/styles';

const SelectSubjectModal = (props) => {
  const { visible, onClose, onSelectSubject, subjects } = props;

  const renderSubjects = (item) => (
    <View style={{ marginTop: RfH(20), flex: 1 }}>
      <TouchableOpacity
        onPress={() => onSelectSubject(item)}
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        }}>
        <>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: RfH(64),
              width: RfW(64),
              marginHorizontal: RfW(4),
              borderRadius: RfW(8),
            }}>
            <IconButtonWrapper
              iconWidth={RfW(64)}
              styling={{ alignSelf: 'center' }}
              iconHeight={RfH(64)}
              imageResizeMode="contain"
              iconImage={getSubjectIcons(item.displayName)}
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
        </>
      </TouchableOpacity>
    </View>
  );

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
            paddingHorizontal: RfW(16),
            paddingTop: RfH(16),
            height: '90%',
          }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>All Subjects</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconWidth={RfW(24)}
              styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
              iconImage={Images.cross}
              submitFunction={onClose}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={4}
            data={subjects}
            renderItem={({ item }) => renderSubjects(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(34) }}
          />
        </View>
      </View>
    </Modal>
  );
};

SelectSubjectModal.defaultProps = {
  visible: false,
  onClose: null,
  onSelectSubject: null,
  subjects: [],
};

SelectSubjectModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelectSubject: PropTypes.func,
  subjects: PropTypes.array,
};

export default SelectSubjectModal;
