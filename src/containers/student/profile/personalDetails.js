import { Dimensions, FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Content, Header, Left, Right, Title } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import IconWrapper from '../../../components/IconWrapper';
import styles from './styles';
import { IND_COUNTRY_OBJ, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { CustomMobileNumber } from '../../../components';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomDropDown from '../../../components/CustomDropDown';
import commonStyles from '../../../theme/styles';
import Fonts from '../../../theme/fonts';
import BackArrow from '../../../components/BackArrow';

const { height, width } = Dimensions.get('window');

function PersonalDetails() {
  const navigation = useNavigation();

  const [isEditDisable, setIsEditDisable] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isGender, setIsGender] = useState('Female');

  const [isFirstName, setIsFirstName] = useState();
  const [isLastName, setIsLastName] = useState();
  const [isEmail, setIsEmail] = useState();
  // const [isGender, setIsGender] = useState('Female');

  // const [isPersonalMenuOpen, setIsPersonalMenuOpen] = useState(true);

  const [accountData, setAccountData] = useState([
    { name: 'Male', icon: Images.radio_button_null },
    { name: 'Female', icon: Images.radio_button_null },
  ]);
  const [date, setDate] = useState('03-01-2020');
  const [disabled, setDisabled] = useState(true);

  // const [formate, setFormate] = useState("DD-MM-YYYY");
  const [showNext, setShowNext] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const _editDetails = () => {
    setIsEditDisable(true);
    setDisabled(!disabled);
  };

  const _saveButton = () => {
    setIsEditDisable(false);
    setDisabled(!disabled);
    setIsAccountMenuOpen(false);
  };

  const onSubmitEditing = () => {
    setShowNext(true);
  };

  const _onDateChange = (date) => {
    console.log('date', date);
    setDate({ date });
    console.log(new Date(date).toISOString());
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const personalDetails = (item) => {
    console.log('accountData====>', item);
    if (item.name == 'Male') {
      setIsGender('Male');
      setIsAccountMenuOpen(!isAccountMenuOpen);
    } else {
      // setIsPersonalMenuOpen(true)
      setIsGender('Female');
      setIsAccountMenuOpen(!isAccountMenuOpen);

      // return null;
    }
  };
  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => personalDetails(item)}
        // disabled={}
        style={[
          styles.userMenuParentView,
          { justifyContent: 'space-between', paddingLeft: RfW(16), marginTop: RfH(20) },
        ]}>
        <View style={{ flexDirection: 'row' }}>
          <IconWrapper iconImage={item.icon} iconHeight={RfH(18)} iconWidth={RfW(20)} />
          <Text style={{ color: Colors.primaryText, marginLeft: RfW(8) }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <Header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottomWidth: null,
        }}>
        <Left>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
            }}>
            <BackArrow action={onBackPress} />
            <View style={{ width: 40 }} />
            <Title
              style={{
                fontSize: RFValue(18, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                color: 'rgb(25,24,24)',
              }}>
              Personal Details
            </Title>
          </View>
        </Left>
        <Right>
          <TouchableOpacity onPress={() => _editDetails()}>
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                color: 'rgb(25,24,24)',
              }}>
              Edit
            </Text>
          </TouchableOpacity>
        </Right>
      </Header>
      <View style={{ height: 20 }} />

      <Content>
        <View style={{ width: width / 1.09, alignSelf: 'center' }}>
          <Image style={styles.userIcon} source={Images.user} />
        </View>
        <View
          style={{
            marginTop: height / 20,
            width: width / 1.1,
            alignSelf: 'center',
          }}>
          <View>
            <Text>First name</Text>
            <TextInput
              style={{ height: 40 }}
              //  editable={false}
              editable={isEditDisable}
              onChangeText={(firstName) => setIsFirstName(firstName)}
              // value={value}
            />
          </View>

          <View style={commonStyles.lineSeparator} />

          <View
            style={{
              marginTop: 12,
            }}>
            <Text>Last name</Text>
            <TextInput
              editable={isEditDisable}
              style={{ height: 40 }}
              onChangeText={(lastName) => setIsLastName(lastName)}
              // value={value}
            />
          </View>

          <View style={commonStyles.lineSeparator} />

          <View
            style={{
              marginTop: 12,
            }}>
            <Text>Email Id</Text>
            <TextInput
              editable={isEditDisable}
              style={{ height: 40 }}
              onChangeText={(email) => setIsEmail(email)}
              // value={value}
            />
          </View>
        </View>

        <View style={commonStyles.lineSeparator} />

        <View
          style={{
            width: width / 1.1,
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text>Phone Number</Text>
          <View style={styles.bottomParent}>
            <View style={{ flex: 1 }}>
              <CustomMobileNumber
                value={mobileObj}
                editable={isEditDisable}
                topMargin={0}
                onChangeHandler={(m) => {
                  setMobileObj(m);
                  setShowClear(true);
                  setShowNext(true);
                }}
                returnKeyType="done"
                refKey="mobileNumber"
                placeholder="Mobile number"
                onSubmitEditing={() => onSubmitEditing()}
              />
            </View>
          </View>
        </View>

        <View style={commonStyles.lineSeparator} />

        <View
          style={{
            height: 70,
            width: width / 1.1,
            justifyContent: 'space-between',
            // backgroundColor:'red'
          }}>
          <Text
            style={{
              color: 'rgb(129,129,129)',
              fontSize: 15,
              marginLeft: 15,
              //   fontFamily: fontFamily('semibold'),
            }}>
            Date of Birth
          </Text>

          <CustomDatePicker />

          {/* <DatePicker */}
          {/*  style={{}} */}
          {/*  date={date} */}
          {/*  mode="date" */}
          {/*  disabled={disabled} */}
          {/*  placeholder="select date" */}
          {/*  format="DD-MM-YYYY" */}
          {/*  minDate="01-01-2020" */}
          {/*  maxDate="01-01-2030" */}
          {/*  confirmBtnText="Confirm" */}
          {/*  cancelBtnText="Cancel" */}
          {/*  onOpenModal={() => setDisabled(true)} */}
          {/*  onCloseModal={() => setDisabled(false)} */}
          {/*  customStyles={{ */}
          {/*    dateIcon: { */}
          {/*      position: 'absolute', */}
          {/*      left: 0, */}
          {/*      //  top: 4, */}
          {/*      marginLeft: width / 1.1, */}
          {/*      backgroundColor: '#FFFFFF', */}
          {/*    }, */}
          {/*    dateInput: { */}
          {/*      marginLeft: -33, */}
          {/*      fontSize: 30, */}
          {/*      borderWidth: null, */}
          {/*      color: 'rgb(129,129,129)', */}
          {/*      backgroundColor: '#FFFFFF', */}
          {/*    }, */}
          {/*    // ... You can check the source to find the other keys. */}
          {/*  }} */}
          {/*  onDateChange={(date) => setDate(date)} */}
          {/* /> */}
        </View>

        <View style={commonStyles.lineSeparator} />

        <View>
          <TouchableWithoutFeedback
            onPress={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            disabled={!isEditDisable}
            style={styles.userMenuParentView}>
            <View style={styles.menuItemParentView}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuItemSecondaryText}>
                Gender
              </Text>
              <Text style={styles.menuItemPrimaryText}>{isGender}</Text>
            </View>
            <IconWrapper
              iconWidth={RfW(24)}
              iconHeight={RfH(24)}
              styling={{ flex: 0.2 }}
              iconImage={isAccountMenuOpen ? Images.collapse_grey : Images.expand_gray}
            />
          </TouchableWithoutFeedback>
        </View>

        <CustomDropDown
          data={[
            { key: 'Male', value: 'Male' },
            { key: 'Female', value: 'Female' },
            { key: 'Other', value: 'Other' },
          ]}
        />

        <View style={commonStyles.lineSeparator} />

        {/* {isAccountMenuOpen && ( */}
        {/*  <SafeAreaView> */}
        {/*    <FlatList */}
        {/*      data={accountData} */}
        {/*      showsVerticalScrollIndicator={false} */}
        {/*      renderItem={({ item }) => renderItem(item)} */}
        {/*      keyExtractor={(item, index) => index.toString()} */}
        {/*    /> */}
        {/*  </SafeAreaView> */}
        {/* )} */}
        {isEditDisable ? (
          <TouchableOpacity
            onPress={() => _saveButton()}
            style={{
              height: RfH(40),
              width: RfW(144),
              borderRadius: 8,
              marginTop: RfH(30),
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.brandBlue2,
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: Fonts.semiBold,
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
              }}>
              Save
            </Text>
          </TouchableOpacity>
        ) : null}
      </Content>
    </Container>
  );
}

export default PersonalDetails;
