import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from '../../student/profile/styles';
import NavigationRouteNames from '../../../routes/screenNames';
import IconWrapper from '../../../components/IconWrapper';
import { WEBSITE_URL } from '../../../utils/constants';

function CustomerCare(props) {
  const navigation = useNavigation();

  const openWhatsApp = () => {
    const url = `whatsapp://send?text=Hi&phone=919891587300`;
    Linking.openURL(url)
      .then((data) => {
        console.log(`WhatsApp Opened successfully ${data}`); // <---Success
      })
      .catch(() => {
        alert('Make sure WhatsApp installed on your device'); // <---Error
      });
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
      <ScreenHeader label="Help & Support" homeIcon horizontalPadding={RfW(16)} lineVisible={false} />
      {/* <View style={commonStyles.blankGreyViewSmall} /> */}
      <View style={commonStyles.blankViewSmall} />
      <Text style={[commonStyles.regularPrimaryText, { padding: RfW(16), fontFamily: Fonts.semiBold }]}>
        Customer Care
      </Text>
      <View style={{ padding: RfW(16), backgroundColor: Colors.white }}>
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:contact@guruq.in`)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.regularPrimaryText}>contact@guruq.in</Text>
            <IconButtonWrapper iconWidth={RfH(24)} iconHeight={RfH(16)} iconImage={Images.email} />
          </View>
        </TouchableOpacity>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <TouchableOpacity onPress={() => Linking.openURL(`tel:1800-419-7300`)}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.regularPrimaryText}>1800-419-7300</Text>
            <IconButtonWrapper iconWidth={RfH(20)} iconHeight={RfH(20)} iconImage={Images.call_blue} />
          </View>
        </TouchableOpacity>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
        <TouchableOpacity onPress={openWhatsApp}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.regularPrimaryText}>+91-9891587300</Text>
            <IconButtonWrapper iconWidth={RfH(20)} iconHeight={RfH(20)} iconImage={Images.whatsapp} />
          </View>
        </TouchableOpacity>

        {/* <View style={[commonStyles.lineSeparator, { marginTop: RfH(16) }]} /> */}
        {/* <View style={{ height: RfH(32) }} /> */}
        {/* <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}> */}
        {/*  Need help with recent Bookings? */}
        {/* </Text> */}
      </View>
      {/* <View style={commonStyles.blankGreyViewSmall} /> */}

      <View style={commonStyles.blankViewSmall} />

      <Text style={[commonStyles.regularPrimaryText, { padding: RfW(16), fontFamily: Fonts.semiBold }]}>FAQs</Text>

      <View style={{ backgroundColor: Colors.white, padding: RfH(16) }}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: `${WEBSITE_URL}/student-faq`,
              label: 'General Issues',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{}}>
            <Text>General Issues</Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}> */}
            {/*  Personal, Addresses, Parents & Education Detail */}
            {/* </Text> */}
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableWithoutFeedback>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: `${WEBSITE_URL}/student-faq`,
              label: 'General Issues',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{}}>
            <Text>Q Points FAQs</Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}> */}
            {/*  Personal, Addresses, Parents & Education Detail */}
            {/* </Text> */}
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableWithoutFeedback>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: `${WEBSITE_URL}/student-faq`,
              label: 'General Issues',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{}}>
            <Text>Booking FAQs</Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}> */}
            {/*  Personal, Addresses, Parents & Education Detail */}
            {/* </Text> */}
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableWithoutFeedback>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        {/* FIXME: change url */}
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: `${WEBSITE_URL}/student-faq`,
              label: 'General Issues',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{}}>
            <Text>Legal Terms & Conditions</Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}> */}
            {/*  Personal, Addresses, Parents & Education Detail */}
            {/* </Text> */}
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

export default CustomerCare;
