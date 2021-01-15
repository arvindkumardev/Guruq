import { Linking, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { alertBox, RfH, RfW } from '../../utils/helpers';
import NavigationRouteNames from '../../routes/screenNames';
import IconWrapper from '../../components/IconWrapper';
import { STUDENT_FAQ_URL, TUTOR_FAQ_URL } from '../../utils/constants';
import { userDetails } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';

function CustomerCare() {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);

  const openWhatsApp = () => {
    const url = `whatsapp://send?text=Hi&phone=919891587300`;
    Linking.openURL(url)
      .then((data) => {
        console.log(`WhatsApp Opened successfully ${data}`); // <---Success
      })
      .catch(() => {
        alertBox('Make sure WhatsApp installed on your device'); // <---Error
      });
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
      <ScreenHeader label="Help & Support" homeIcon horizontalPadding={RfW(16)} lineVisible={false} />
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
      </View>

      <View style={commonStyles.blankViewSmall} />

      <Text style={[commonStyles.regularPrimaryText, { padding: RfW(16), fontFamily: Fonts.semiBold }]}>FAQs</Text>

      <View style={{ backgroundColor: Colors.white, padding: RfH(16) }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: userInfo.type === UserTypeEnum.STUDENT.label ? STUDENT_FAQ_URL : TUTOR_FAQ_URL,
              label: 'General Issues',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.regularPrimaryText}>General Issues</Text>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableOpacity>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: userInfo.type === UserTypeEnum.STUDENT.label ? STUDENT_FAQ_URL : TUTOR_FAQ_URL,
              label: 'Q Points FAQ',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.regularPrimaryText}>Q Points FAQs</Text>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableOpacity>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: userInfo.type === UserTypeEnum.STUDENT.label ? STUDENT_FAQ_URL : TUTOR_FAQ_URL,
              label: 'Booking FAQs',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.regularPrimaryText}>Booking FAQs</Text>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableOpacity>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationRouteNames.WEB_VIEW, {
              url: userInfo.type === UserTypeEnum.STUDENT.label ? STUDENT_FAQ_URL : TUTOR_FAQ_URL,
              label: 'Legal Terms & Conditions',
            })
          }
          style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text style={commonStyles.regularPrimaryText}>Legal Terms & Conditions</Text>
          </View>
          <IconWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
            iconImage={Images.right_arrow_grey}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomerCare;
