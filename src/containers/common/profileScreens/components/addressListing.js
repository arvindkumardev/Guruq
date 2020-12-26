import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../../utils/constants';
import { Colors, Images } from '../../../../theme';
import { IconButtonWrapper } from '../../../../components';
import routeNames from '../../../../routes/screenNames';

function AddressListing(props) {
  const navigation = useNavigation();
  const { referenceType, referenceId, details, onUpdate, isUpdateAllowed } = props;
  const [addresses, setAddresses] = useState([
    { type: 'Home Address', firstrow: '28/13, Vasant Vihar', secondrow: 'Delhi', thirdRow: 'Delhi, India , 110024' },
  ]);

  const renderAddress = (item) => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper iconImage={Images.home} iconWidth={RfW(16)} iconHeight={RfH(16)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.regularPrimaryText}>{item.type}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.firstrow}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.secondrow}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.thirdRow}</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.ADD_EDIT_ADDRESS)}>
            <Text style={{ color: Colors.orange }}>Edit</Text>
          </TouchableWithoutFeedback>
          <Text style={{ color: Colors.orange }}>Delete</Text>
        </View>
        <View style={commonStyles.lineSeparator} />
      </View>
    );
  };
  return (
    <View style={{ paddingHorizontal: RfW(16) }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={addresses}
        renderItem={({ item, index }) => renderAddress(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

AddressListing.propTypes = {
  referenceType: PropTypes.string,
  referenceId: PropTypes.number,
  details: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

AddressListing.defaultProps = {
  referenceType: '',
  referenceId: 0,
  details: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default AddressListing;
