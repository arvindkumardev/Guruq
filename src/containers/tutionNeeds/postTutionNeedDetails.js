import { Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../components';
import { offeringsMasterData } from '../../apollo/cache';

function PostTutionNeedDetails(props) {
  const { route } = props;

  const subjectData = route?.params?.subjectData;
  const navigation = useNavigation();
  const [noOfCllasses, setNoOfCllasses] = useState(1);
  const [maxPrice, setMaxPrice] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isIndividual, setIsIndividual] = useState(true);
  const [noOfGroupClasses, setNoOfGroupClasses] = useState(2);

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Post your tution needs" horizontalPadding={RfW(16)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RfH(16), paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(34) }} />
        <Text style={commonStyles.headingPrimaryText}>Subject Details</Text>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View>
          <Text style={[commonStyles.headingMutedText]}>{subjectData?.studyArea?.displayName}</Text>
          <Text style={[commonStyles.headingMutedText, { marginTop: RfW(8) }]}>{subjectData?.board?.displayName}</Text>
          <Text style={[commonStyles.headingMutedText, { marginTop: RfW(8) }]}>{subjectData?.class?.displayName}</Text>
          {subjectData?.subject?.map((obj) => {
            return <Text style={[commonStyles.headingMutedText, { marginTop: RfW(8) }]}>{obj.displayName}</Text>;
          })}
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </View>
        <Text style={commonStyles.headingPrimaryText}>Mode of Tution</Text>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View>
          <TouchableWithoutFeedback onPress={() => setIsOnline(true)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton iconWidth={RfW(20)} iconHeight={RfH(20)} enabled={isOnline} />
              <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Online Class</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setIsOnline(false)}>
            <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(16) }]}>
              <CustomRadioButton iconWidth={RfW(20)} iconHeight={RfH(20)} enabled={!isOnline} />
              <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Home Tution</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </View>
        <Text style={commonStyles.headingPrimaryText}>Type of Tution</Text>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View>
          <TouchableWithoutFeedback onPress={() => setIsIndividual(true)}>
            <View style={commonStyles.horizontalChildrenView}>
              <CustomRadioButton iconWidth={RfW(20)} iconHeight={RfH(20)} enabled={isIndividual} />
              <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Individual Class</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
            <TouchableWithoutFeedback onPress={() => setIsIndividual(false)}>
              <View style={commonStyles.horizontalChildrenView}>
                <CustomRadioButton iconWidth={RfW(20)} iconHeight={RfH(20)} enabled={!isIndividual} />
                <Text style={[commonStyles.headingMutedText, { marginLeft: RfW(8) }]}>Group Class</Text>
              </View>
            </TouchableWithoutFeedback>
            {!isIndividual && (
              <View>
                <View style={styles.bookingSelectorParent}>
                  <View style={styles.bookingSelectorParent}>
                    <TouchableWithoutFeedback>
                      <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                        <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                      </View>
                    </TouchableWithoutFeedback>

                    <Text>{noOfGroupClasses}</Text>

                    <TouchableWithoutFeedback>
                      <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                        <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            )}
          </View>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </View>
        <Text style={commonStyles.headingPrimaryText}>No of Classes</Text>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View>
          <View style={styles.bookingSelectorParent}>
            <View style={styles.bookingSelectorParent}>
              <TouchableWithoutFeedback>
                <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                </View>
              </TouchableWithoutFeedback>

              <Text>{noOfCllasses}</Text>

              <TouchableWithoutFeedback>
                <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                  <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        </View>
        <Text style={commonStyles.headingPrimaryText}>Maximum price/ hour willing to pay </Text>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Item floatingLabel style={{ flex: 0.5 }}>
            <Input placeholder="Min Price" value={maxPrice} onChangeText={(text) => setMaxPrice(text)} />
          </Item>
          <Item floatingLabel style={{ flex: 0.5, marginLeft: RfW(8) }}>
            <Input placeholder="Max Price" value={maxPrice} onChangeText={(text) => setMaxPrice(text)} />
          </Item>
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
      </ScrollView>
      <Button
        block
        style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginBottom: RfH(34), marginTop: RfH(8) }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </Button>
    </View>
  );
}

export default PostTutionNeedDetails;
