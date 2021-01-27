import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import { RfH, RfW } from '../../utils/helpers';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import styles from './styles';
import NavigationRouteNames from '../../routes/screenNames';
import { GET_CURRENT_TUTOR_QUERY } from '../common/graphql-query';
import { tutorDetails } from '../../apollo/cache';
import ActionModal from './components/helpSection';

const PriceAndSchedule = () => {
  const navigation = useNavigation();
  const [openMenu, setOpenMenu] = useState(false);

  const isFocussed = useIsFocused();
  const [getCurrentTutor, { loading: getCurrentTutorLoading }] = useLazyQuery(GET_CURRENT_TUTOR_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {},
    onCompleted: (data) => {
      if (data) {
        tutorDetails(data?.getCurrentTutor);
      }
    },
  });
  useEffect(() => {
    if (isFocussed) {
      getCurrentTutor();
    }
  }, [isFocussed]);

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={getCurrentTutorLoading} />
      <ScreenHeader
        showRightIcon
        rightIcon={Images.vertical_dots_b}
        onRightIconClick={() => setOpenMenu(true)}
        label="Availability & Price"
        horizontalPadding={RfW(16)}
        homeIcon={false}
      />
      {openMenu && <ActionModal isVisible={openMenu} closeMenu={() => setOpenMenu(false)} />}
      <View style={{ paddingHorizontal: RfW(20), paddingVertical: RfH(15) }}>
        <Text style={commonStyles.headingPrimaryText}>Mark your Availability and Update your Price/hour.</Text>
      </View>
      <TouchableOpacity
        style={[styles.interviewCard, { borderLeftColor: Colors.orange }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.VIEW_SCHEDULE)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.schedule_interview}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <View>
            <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Add Availability</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
            <IconButtonWrapper
              iconImage={Images.right_arrow_grey}
              iconWidth={RfH(24)}
              iconHeight={RfW(24)}
              imageResizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.interviewCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(NavigationRouteNames.TUTOR.SUBJECTS_LIST)}>
        <View style={{ flexDirection: 'row' }}>
          <IconButtonWrapper
            iconImage={Images.price_metrics}
            iconWidth={RfH(24)}
            iconHeight={RfW(24)}
            imageResizeMode="contain"
          />
          <View>
            <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(10) }]}>Add Subject Price Matrix</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
            <IconButtonWrapper
              iconImage={Images.right_arrow_grey}
              iconWidth={RfH(24)}
              iconHeight={RfW(24)}
              imageResizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ marginTop: RfH(34) }}>
        <Text style={commonStyles.headingMutedText}>
          Note: Students will not be able to book classes with you without this information.
        </Text>
      </View>
    </View>
  );
};

export default PriceAndSchedule;
