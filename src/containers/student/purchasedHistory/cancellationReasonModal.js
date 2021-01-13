import React, { useState } from 'react';
import { FlatList, Keyboard, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { isEmpty } from 'lodash';
import { CustomRadioButton, IconButtonWrapper } from '../../../components';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import { ClassCancelReasonEnum } from '../../common/enums';

function CancellationOrderModal(props) {
  const { isVisible, handleCancelOrder, handleClose } = props;
  const [cancelReason, setCancelReason] = useState('');
  const [otherComments, setOtherComments] = useState('');
  const [reasons, setReasons] = useState(
    Object.values(ClassCancelReasonEnum).map((c) => {
      return { ...c, selected: false, isCustom: c.label === ClassCancelReasonEnum.OTHER.label };
    })
  );

  const handleSubmit = () => {
    if (cancelReason.isCustom && isEmpty(otherComments)) {
      alertBox('Please provide reason for cancellation');
    } else {
      handleCancelOrder(cancelReason.label, otherComments);
    }
  };

  const onReasonChange = (index) => {
    if (!reasons[index].selected) {
      setReasons((reasons) =>
        reasons.map((reasonItem, reasonIndex) => ({ ...reasonItem, selected: reasonIndex === index }))
      );
      setCancelReason(reasons[index]);
      setOtherComments((otherComments) => (!reasons[index].isCustom ? '' : otherComments));
    }
  };

  const renderReasons = (item, index) => (
    <TouchableOpacity onPress={() => onReasonChange(index)} activeOpacity={0.8}>
      <View style={commonStyles.horizontalChildrenView}>
        <CustomRadioButton enabled={item.selected} submitFunction={() => onReasonChange(index)} />
        <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }}>{item.displayName}</Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginVertical: RfH(16) }} />
    </TouchableOpacity>
  );

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
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
          opacity: 1,
          paddingBottom: RfH(34),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: RfW(16),
            paddingVertical: RfH(10),
            backgroundColor: Colors.lightBlue,
          }}>
          <Text style={commonStyles.headingPrimaryText}>Please provide the reason for cancellation</Text>
          <IconButtonWrapper
            iconHeight={RfH(20)}
            iconWidth={RfW(20)}
            iconImage={Images.cross}
            submitFunction={handleClose}
            imageResizeMode="contain"
          />
        </View>
        <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(16) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={reasons}
            renderItem={({ item, index }) => renderReasons(item, index)}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              <>
                {reasons.some((item) => item.isCustom && item.selected) && (
                  <TextInput
                    placeholder="Provide a reason"
                    style={{
                      borderRadius: RfH(8),
                      borderColor: Colors.darkGrey,
                      borderWidth: 0.7,
                      marginBottom: RfH(5),
                      padding: 8,
                      height: RfH(80),
                    }}
                    multiline
                    blurOnSubmit
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    onChangeText={(val) => setOtherComments(val)}
                    returnKeyType="done"
                  />
                )}
              </>
            }
          />
        </View>
        <View style={{ marginTop: RfH(32) }}>
          <Button
            onPress={handleSubmit}
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', backgroundColor: Colors.orangeRed }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default CancellationOrderModal;
