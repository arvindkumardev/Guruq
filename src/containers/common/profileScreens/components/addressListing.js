import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors, Images } from '../../../../theme';
import { IconButtonWrapper } from '../../../../components';
import routeNames from '../../../../routes/screenNames';

function AddressListing(props) {
  const navigation = useNavigation();
  const { referenceType, referenceId, details, onUpdate, isUpdateAllowed } = props;

  const renderAddress = (item) => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper iconImage={Images.home} iconWidth={RfW(16)} iconHeight={RfH(16)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.regularPrimaryText}>{item.type}</Text>
            <Text style={commonStyles.mediumMutedText}>{`${item.street}, ${item.subArea}`}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.city}</Text>
            <Text style={commonStyles.mediumMutedText}>{`${item.State}, ${item.country}`}</Text>
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
        data={details}
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
