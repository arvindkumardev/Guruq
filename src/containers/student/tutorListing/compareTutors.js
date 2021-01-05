import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Colors, Images } from '../../../theme';
import { getFullName, getSaveData, getTutorImage, removeData, RfH, RfW, storeData } from '../../../utils/helpers';
import styles from './styles';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';

function compareTutors() {
  const navigation = useNavigation();
  const [tutorData, setTutorData] = useState([]);

  const removeFromCompare = async (index) => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    compareArray.splice(index, 1);
    await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
    if (compareArray.length > 0) {
      storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(compareArray)).then(() => {});
    }
    navigation.goBack();
  };

  const renderTutorView = (item, index) => {
    return (
      <View style={commonStyles.verticallyStretchedItemsView}>
        <IconButtonWrapper
          iconWidth={RfH(20)}
          iconHeight={RfH(20)}
          iconImage={Images.cross}
          imageResizeMode="contain"
          styling={styles.crossIcon}
          submitFunction={() => removeFromCompare(index)}
        />
        <IconButtonWrapper
          iconWidth={RfH(70)}
          iconHeight={RfH(70)}
          iconImage={getTutorImage(item)}
          imageResizeMode="contain"
          styling={{ alignSelf: 'center', borderRadius: RfH(12) }}
        />
        {/* FIXME */}
        <Text style={styles.compareTutorName}>{getFullName(item?.contactDetail)}</Text>
        <Text style={{ color: Colors.darkGrey, alignSelf: 'center' }}>₹ 350/ hour</Text>
        <View style={[commonStyles.horizontalChildrenCenterView, { marginTop: RfH(8) }]}>
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfH(18)} iconImage={Images.user_board} />
          <IconButtonWrapper
            iconHeight={RfH(18)}
            iconWidth={RfH(18)}
            iconImage={Images.heart}
            imageResizeMode="contain"
            styling={{ marginHorizontal: RfW(16) }}
          />
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfH(18)} iconImage={Images.share} />
        </View>
        <Button block bordered style={{ marginHorizontal: RfW(16), marginTop: RfH(24) }}>
          <Text style={{ color: Colors.brandBlue2 }}>Book Class</Text>
        </Button>
      </View>
    );
  };
  //
  // const getTutorData=(offerings)=>{
  //     const data = {online:false,offline:false,demo:false,price:0}
  //     offerings.forEach(offering=>{
  //         offering.budgets.forEach()
  //
  //     })
  //
  // }

  const checkCompare = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    setTutorData(compareArray);
  };

  useEffect(() => {
    checkCompare();
  }, []);

  const renderBasicInfoView = (item) => {
    return (
      <View style={styles.informationParentMargin}>
        <Text style={styles.switchText}>Basic Information</Text>
        <Text style={[styles.infoCategoryText, { marginTop: RfH(16) }]}>User Reviews</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.horizontalChildrenView}>
            <Text>{item[0]?.averageRating}</Text>
            <IconButtonWrapper
              iconWidth={RfW(76)}
              iconHeight={RfH(13)}
              iconImage={Images.four_stars}
              imageResizeMode="contain"
              styling={{ marginHorizontal: RfH(6) }}
            />
            <IconButtonWrapper
              iconWidth={RfW(13)}
              iconHeight={RfH(13)}
              iconImage={Images.grey_star}
              imageResizeMode="contain"
              styling={{ alignSelf: 'center' }}
            />
          </View>
          <View style={commonStyles.horizontalChildrenView}>
            <IconButtonWrapper
              iconWidth={RfW(13)}
              iconHeight={RfH(13)}
              iconImage={Images.grey_star}
              styling={{ alignSelf: 'center' }}
            />
            <IconButtonWrapper
              iconWidth={RfW(76)}
              iconHeight={RfH(13)}
              iconImage={Images.four_stars}
              styling={{ marginHorizontal: RfH(6) }}
            />
            <Text>{item[1]?.averageRating}</Text>
          </View>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.ratingText}>{item[0]?.reviewCount} reviews</Text>
          <Text style={styles.ratingText}>{item[1]?.reviewCount} reviews</Text>
        </View>
        {item[0]?.educationDetails &&
          item[0]?.educationDetails[0]?.degree &&
          item[1]?.educationDetails &&
          item[1]?.educationDetails[0]?.degree && (
            <View>
              <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
              <Text style={styles.infoCategoryText}>Qualification</Text>

              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Text style={styles.qualificationItemText}>
                  {item[0]?.educationDetails &&
                    item[0]?.educationDetails[0]?.degree &&
                    item[0]?.educationDetails[0]?.degree?.name}
                </Text>
                <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>
                  {item[1]?.educationDetails &&
                    item[1]?.educationDetails[0]?.degree &&
                    item[1]?.educationDetails[0]?.degree?.name}
                </Text>
              </View>
            </View>
          )}
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Experience</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.qualificationItemText}>{item[0]?.teachingExperience} Years</Text>
          <Text style={[styles.qualificationItemText, { textAlign: 'right' }]}>
            {item[1]?.teachingExperience} Years
          </Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Mode of Tuition</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.laptop}
                styling={{ alignSelf: 'center' }}
                imageResizeMode="contain"
              />
              <Text style={styles.typeItemText}>Online</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.home}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Offline</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.laptop}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Online</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.home}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Offline</Text>
            </View>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6) }]} />
        <Text style={styles.infoCategoryText}>Type</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12) }]}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.single_user}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Individual</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.multiple_user}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Group</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(11)}
                iconWidth={RfW(18)}
                iconImage={Images.single_user}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Individual</Text>
            </View>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(13)}
                iconWidth={RfW(18)}
                iconImage={Images.multiple_user}
                imageResizeMode="contain"
                styling={{ alignSelf: 'center' }}
              />
              <Text style={styles.typeItemText}>Group</Text>
            </View>
          </View>
        </View>
        <View style={[commonStyles.lineSeparator, { marginTop: RfH(6), marginBottom: RfH(34) }]} />
      </View>
    );
  };
  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <ScreenHeader label="Compare Tutors" horizontalPadding={16} lineVisible homeIcon />
      {!isEmpty(tutorData) && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8), paddingHorizontal: RfW(16) }]}>
            <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[0], 0)}</View>
            <View style={{ flex: 0.5 }}>{renderTutorView(tutorData[1], 1)}</View>
          </View>
          <View>{renderBasicInfoView(tutorData)}</View>
        </ScrollView>
      )}
    </View>
  );
}

export default compareTutors;
