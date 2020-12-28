import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, Input, Item } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { CustomCheckBox, ScreenHeader } from '../../../components';
import { userDetails } from '../../../apollo/cache';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import routeNames from '../../../routes/screenNames';

function AddEditEducation() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Education" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(44) }} />
        <View>
          <Text style={commonStyles.smallMutedText}>Name of Institution</Text>
          <Item>
            <Input value="Delhi Public School" />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>Board</Text>
              <Item>
                <Input value="CBSE" />
              </Item>
            </View>
            <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>Class</Text>
              <Item>
                <Input value="9" />
              </Item>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>Start Date</Text>
              <View style={{ height: RfH(56), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                <CustomDatePicker value={new Date()} />
              </View>
            </View>
            <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
              <Text style={commonStyles.smallMutedText}>End Date</Text>
              <View style={{ height: RfH(56), borderBottomColor: Colors.darkGrey, borderBottomWidth: 1 }}>
                <CustomDatePicker value={new Date()} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View style={commonStyles.horizontalChildrenView}>
          <CustomCheckBox enabled />
          <Text style={{ marginLeft: RfW(16) }}>Currently studying</Text>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AddEditEducation;
