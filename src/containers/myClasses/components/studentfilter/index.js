
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'native-base';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import Fonts from '../../../../theme/fonts';
import { CustomRadioButton, IconButtonWrapper } from '../../../../components';
import commonStyles from '../../../../theme/styles';

const StudentFilterComponent = (props) => {
  const { visible, onClose, onSelect, students, clearSelection, title, currentStudent } =
    props;
    
  const [selectedOffering, setSelectedOffering] = useState(currentStudent);
  useEffect(() => {
    if (students && students.length > 0) {
      const selectedOffering = students.find((s) => s.selected);

      if (selectedOffering) {
        setSelectedOffering(selectedOffering);
      }
    }
  }, [students]);

  const renderItem = (item, index, showSeparator) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => setSelectedOffering(item)}
          style={{ height: 44, flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={0.8}>
          <CustomRadioButton
            enabled={item?.id === selectedOffering?.id}
            submitFunction={() => setSelectedOffering(item)}
          />

          <Text style={{ color: Colors.primaryText, marginLeft: RfW(8) }}>
            {item?.contactDetail?.firstName} {' '}
            {item?.contactDetail?.lastName}
          </Text>
        </TouchableOpacity>
        {showSeparator && <View style={commonStyles.lineSeparator} />}
      </>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'column',
        }}>
        <View
          style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }}
        />
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
            <Text
              style={{
                color: Colors.primaryText,
                fontSize: 18,
                fontFamily: Fonts.semiBold,
              }}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <IconButtonWrapper
                iconImage={Images.cross}
                iconWidth={RfW(20)}
                iconHeight={RfH(20)}
              />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />

          <FlatList
            data={students}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) =>
              renderItem(item, index, students.length - 1 > index)
            }
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
											
              style={{
                flex: 0.5,
                 backgroundColor: selectedOffering? Colors.brandBlue2:Colors.greyBlue,
                marginRight: RfW(4),
              }}
              onPress={() => selectedOffering && onSelect(selectedOffering)}>
              <Text
                style={[
                  commonStyles.headingPrimaryText,
                  { color: Colors.white },
                ]}>
                Search
              </Text>
            </Button>
            <Button
              bordered
              style={{
                flex: 0.5,
                borderColor: Colors.brandBlue2,
                justifyContent: 'center',
                marginLeft: RfW(4),
              }}
              onPress={() => {
                setSelectedOffering({});
                clearSelection();
              }}>
              <Text
                style={[
                  commonStyles.headingPrimaryText,
                  { color: Colors.brandBlue2 },
                ]}>
                Clear Selection
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

StudentFilterComponent.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  students: PropTypes.array,
  title: PropTypes.string,
  isStudent: PropTypes.bool,
};

export default StudentFilterComponent;
