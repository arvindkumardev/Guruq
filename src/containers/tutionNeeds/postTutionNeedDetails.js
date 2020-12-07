import { Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import styles from './styles';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { offeringsMasterData } from '../../apollo/cache';

function PostTutionNeedDetails() {
  const navigation = useNavigation();
  const [showTutionMode, setShowTutionMode] = useState(false);
  const [showTutionType, setShowTutionType] = useState(false);
  const [showNoOfClasses, setShowNoOfClasses] = useState(false);
  const [showMaxPrice, setShowMaxPrice] = useState(false);
  const [noOfCllasses, setNoOfCllasses] = useState(1);
  const [maxPrice, setMaxPrice] = useState(0);

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader
        homeIcon
        label="Post your tution needs"
        showRightIcon
        rightIcon={Images.moreInformation}
        horizontalPadding={RfW(16)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RfH(16), paddingHorizontal: RfW(16) }}>
        <View style={{ height: RfH(34) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.headingPrimaryText}>Subject Details</Text>
          <IconButtonWrapper iconHeight={RfH(24)} iconImage={Images.chevronRight} iconWidth={RfW(24)} />
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <TouchableWithoutFeedback onPress={() => setShowTutionMode(!showTutionMode)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>Mode of Tution</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconImage={showTutionMode ? Images.expand : Images.chevronRight}
              iconWidth={RfW(24)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        {showTutionMode && (
          <View>
            <Text style={commonStyles.headingMutedText}>Online Class</Text>
            <Text style={[commonStyles.headingMutedText, { marginTop: RfH(16) }]}>Home Tution</Text>
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
        )}
        <TouchableWithoutFeedback onPress={() => setShowTutionType(!showTutionType)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>Type of Tution</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconImage={showTutionType ? Images.expand : Images.chevronRight}
              iconWidth={RfW(24)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        {showTutionType && (
          <View>
            <Text style={commonStyles.headingMutedText}>Individual Class</Text>
            <Text style={[commonStyles.headingMutedText, { marginTop: RfH(16) }]}>Group Class</Text>
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
        )}
        <TouchableWithoutFeedback onPress={() => setShowNoOfClasses(!showNoOfClasses)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>No of Classes</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconImage={showNoOfClasses ? Images.expand : Images.chevronRight}
              iconWidth={RfW(24)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        {showNoOfClasses && (
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
        )}
        <TouchableWithoutFeedback onPress={() => setShowMaxPrice(!showMaxPrice)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>Maximum price/ hour willing to pay </Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconImage={showMaxPrice ? Images.expand : Images.chevronRight}
              iconWidth={RfW(24)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        {showMaxPrice && (
          <View>
            <Text style={commonStyles.headingMutedText}>₹{maxPrice}</Text>
            <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default PostTutionNeedDetails;
