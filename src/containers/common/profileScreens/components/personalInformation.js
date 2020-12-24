import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Item, Input } from 'native-base';
import commonStyles from '../../../../theme/styles';
import { CustomMobileNumber, IconButtonWrapper } from '../../../../components';
import { RfH, RfW } from '../../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../../utils/constants';
import { Colors, Images } from '../../../../theme';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import GenderModal from './genderModal';

function PersonalInformation(props) {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const { referenceType, referenceId, details, onUpdate, isUpdateAllowed } = props;
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const showModal = () => {
    console.log('triggred');
    setShowGenderModal(true);
  };
  return (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <ScrollView contentContainerStyle={{ paddingBottom: RfH(32) }}>
        <IconButtonWrapper
          iconHeight={RfH(80)}
          iconWidth={RfW(80)}
          iconImage={Images.user}
          styling={{ borderRadius: RfH(8) }}
        />
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>First name</Text>
        <Item>
          <Input value="Sheena" />
        </Item>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Last name</Text>
        <Item>
          <Input value="Jain" />
        </Item>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Email Id</Text>
        <Item>
          <Input value="Sheenajain123@gmail.com" />
        </Item>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Phone Number</Text>
        <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
          <CustomMobileNumber
            value={mobileObj}
            topMargin={0}
            onChangeHandler={(m) => setMobileObj(m)}
            returnKeyType="done"
            refKey="mobileNumber"
            placeholder="Mobile number"
            label={' '}
          />
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Date of birth</Text>

        <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
          <CustomDatePicker value={new Date()} />
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Gender</Text>
        <TouchableWithoutFeedback onPress={() => showModal()}>
          <View style={{ height: RfH(44), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
            <Text>Female</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <GenderModal visible={showGenderModal} onClose={() => setShowGenderModal(false)} />
    </View>
  );
}

PersonalInformation.propTypes = {
  referenceType: PropTypes.string,
  referenceId: PropTypes.number,
  details: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

PersonalInformation.defaultProps = {
  referenceType: '',
  referenceId: 0,
  details: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default PersonalInformation;
