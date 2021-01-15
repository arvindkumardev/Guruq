import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../theme/colors';
import { printDate, printTime, RfH, RfW, getSubjectIcons } from '../../../utils/helpers';
import Images from '../../../theme/images';
import IconButtonWrapper from '../../../components/IconWrapper';
import Fonts from '../../../theme/fonts';
import commonStyles from '../../../theme/styles';

const MeetingDetailsModal = (props) => {
  const { visible, onClose, meetingDetails } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, paddingBottom: 34, backgroundColor: 'transparent', flexDirection: 'column' }}>
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
            paddingBottom: RfH(44),
            // paddingVertical: RfW(16),
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>Class Details</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(20)} iconHeight={RfH(20)} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
            <View
              style={{
                height: RfH(72),
                width: RfW(72),
                backgroundColor: Colors.lightPurple,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text style={commonStyles.headingPrimaryText}>{`${meetingDetails.title}`}</Text>
              <Text style={commonStyles.mediumMutedText}>{`${meetingDetails.description}`}</Text>
              <Text style={commonStyles.mediumMutedText}>
                {printDate(meetingDetails?.startDate)}
                {' at '}
                {printTime(meetingDetails?.startDate)} {' - '}
                {printTime(meetingDetails?.endDate)}
              </Text>
            </View>
            <View>
              <IconButtonWrapper />
            </View>
          </View>

          <View style={{ height: 34 }} />
        </View>
      </View>
    </Modal>
  );
};

MeetingDetailsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default MeetingDetailsModal;
