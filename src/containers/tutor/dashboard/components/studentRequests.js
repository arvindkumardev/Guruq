import { FlatList, View, Text } from 'react-native';
import React, { useState } from 'react';
import commonStyles from '../../../../theme/styles';
import { ScreenHeader } from '../../../../components';
import { Colors } from '../../../../theme';
import { RfW } from '../../../../utils/helpers';

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const renderItems = () => {
    return (
      <View>
        <Text>Works</Text>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Students Request" homeIcon horizontalPadding={RfW(16)} />
      <FlatList
        data={requests}
        renderItem={({ item, index }) => renderItems(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default StudentRequests;
