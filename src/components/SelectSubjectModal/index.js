import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, Text, View, TouchableOpacity } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { Colors, Images } from '../../theme';
import { getSubjectIcons, RfH, RfW } from '../../utils/helpers';
import IconButtonWrapper from '../IconWrapper';
import commonStyles from '../../theme/styles';
import { interestingOfferingData, offeringsMasterData } from '../../apollo/cache';

const SelectSubjectModal = (props) => {
  const { visible, onClose, onSelectSubject } = props;
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const interestedOfferings = useReactiveVar(interestingOfferingData);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (visible) {
      setSubjects(
        offeringMasterData.filter(
          (s) => s?.parentOffering?.id === interestedOfferings.find((offering) => offering.selected)?.offering?.id
        )
      );
    }
  }, [visible]);

  const renderSubjects = (item) => (
    <TouchableOpacity
      onPress={() => onSelectSubject(item)}
      style={{
        flexDirection: 'column',
        marginTop: RfH(20),
        flex: 0.25,
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(5),
          borderRadius: RfW(8),
        }}>
        <IconButtonWrapper
          iconWidth={RfW(64)}
          styling={{ alignSelf: 'center' }}
          iconHeight={RfH(64)}
          imageResizeMode="contain"
          iconImage={getSubjectIcons(item.displayName)}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: Colors.primaryText,
            marginTop: RfH(5),
          }}>
          {item.displayName}
        </Text>
      </View>
    </TouchableOpacity>
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
            // paddingHorizontal: RfW(16),
            // paddingVertical: RfH(20),
            maxHeight: '90%',
          }}>
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              { backgroundColor: Colors.lightBlue, paddingHorizontal: RfW(16) },
            ]}>
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
};

SelectSubjectModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelectSubject: PropTypes.func,
};

export default SelectSubjectModal;
