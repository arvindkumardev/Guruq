import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors, Images } from '../../../../theme';
import { IconButtonWrapper } from '../../../../components';
import routeNames from '../../../../routes/screenNames';

function ParentsListing(props) {
  const navigation = useNavigation();
  const { referenceType, referenceId, details, onUpdate, isUpdateAllowed } = props;
  const [addresses, setAddresses] = useState([
    { name: 'Ravi Kumar', mobile: '+91-9876543210', email: 'Ravikumar123@gmail.com' },
  ]);

  const renderAddress = (item) => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper iconImage={Images.parent_details} iconWidth={RfW(16)} iconHeight={RfH(20)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.regularPrimaryText}>{item.name}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.mobile}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.email}</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16), marginBottom: RfH(8) }]}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.ADD_EDIT_PARENTS)}>
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

ParentsListing.propTypes = {
  referenceType: PropTypes.string,
  referenceId: PropTypes.number,
  details: PropTypes.object,
  onUpdate: PropTypes.func,
  isUpdateAllowed: PropTypes.bool,
};

ParentsListing.defaultProps = {
  referenceType: '',
  referenceId: 0,
  details: {},
  onUpdate: null,
  isUpdateAllowed: false,
};

export default ParentsListing;
