import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import Fonts from '../../../../theme/fonts';
import { CustomRadioButton, IconButtonWrapper } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import NavigationRouteNames from '../../../../routes/screenNames';

const StudentOfferingModal = (props) => {
  const navigation = useNavigation();

  const { visible, onClose, onSelect, offerings } = props;

  const [selectedOffering, setSelectedOffering] = useState({});

  useEffect(() => {
    if (offerings && offerings.length > 0) {
      const selectedOffering = offerings.find((s) => s.selected);
      console.log('selectedOffering', selectedOffering);
      if (selectedOffering) {
        setSelectedOffering(selectedOffering.offering);
      }
    }
  }, [offerings]);

  const renderItem = (item, index, showSeparator) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedOffering(item.offering)}>
        <View style={{ height: 44, flexDirection: 'row', alignItems: 'center' }}>
          <CustomRadioButton
            enabled={item?.offering?.id === selectedOffering?.id}
            submitFunction={() => setSelectedOffering(item.offering)}
          />
          <Text style={{ color: Colors.primaryText, marginLeft: RfW(8) }}>
            {item?.offering?.parentOffering?.displayName} - {item?.offering?.displayName}
          </Text>
        </View>
        {showSeparator && <View style={commonStyles.lineSeparator} />}
      </TouchableWithoutFeedback>
    );
  };

  const addStudyArea = () => {
    onClose(false);
    navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
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
            // paddingVertical: RfW(16),
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ color: Colors.primaryText, fontSize: 18, fontFamily: Fonts.semiBold }}>
              Choose your study area
            </Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <FlatList
            data={offerings}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index, offerings.length - 1 > index)}
            keyExtractor={(item, index) => index.toString()}
            style={{}}
          />

          <View style={{ height: 34 }} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              height: RfH(48),
              paddingTop: RfH(4),
              paddingBottom: RfH(4),
              marginBottom: RfH(34),
            }}>
            <Button
              block
              style={{ flex: 0.5, backgroundColor: Colors.brandBlue2, marginRight: RfW(4) }}
              onPress={() => onSelect(selectedOffering)}>
              <Text style={[commonStyles.headingPrimaryText, { color: Colors.white }]}>Select</Text>
            </Button>
            <Button
              bordered
              style={{
                flex: 0.5,
                borderColor: Colors.brandBlue2,
                justifyContent: 'center',
                marginLeft: RfW(4),
              }}
              onPress={() => addStudyArea()}>
              <Text style={[commonStyles.headingPrimaryText, { color: Colors.brandBlue2 }]}>Add study area</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

StudentOfferingModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  offerings: PropTypes.array,
};

export default StudentOfferingModal;
