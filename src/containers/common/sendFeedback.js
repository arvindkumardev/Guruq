import { View, Text, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Input, Item, Textarea, Button } from 'native-base';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Fonts } from '../../theme';
import { getFullName, RfH, RfW } from '../../utils/helpers';
import { ADD_ENQUIRY } from './graphql-mutation';
import { userDetails } from '../../apollo/cache';
import { SEARCH_IN_INQUIRY } from './graphql-query';

function SendFeedback(props) {
  const navigation = useNavigation();
  const { route } = props;

  const orderId = route?.params?.orderId;
  const classId = route?.params?.classId;

  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const userInfo = useReactiveVar(userDetails);
  const [feedbackData, setFeedbackData] = useState([]);

  const [addEnquiry, { loading: addEnquiryLoading }] = useMutation(ADD_ENQUIRY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Feedback sent!');
        navigation.goBack();
      }
    },
  });

  const onAddingEnquiry = () => {
    if (!query) {
      Alert.alert('Please enter subject!');
    } else if (!message) {
      Alert.alert('Please enter message!');
    } else {
      const inquiryDto = {
        name: getFullName(userInfo),
        mobile: userInfo.phoneNumber.number,
        email: userInfo.email,
        title: query,
        text: message,
        source: 'APP',
      };

      if (orderId > 0) {
        inquiryDto.order = { id: orderId };
        inquiryDto.type = 'SUPPORT';
      }
      if (classId > 0) {
        inquiryDto.classEntity = { id: classId };
        inquiryDto.type = 'SUPPORT';
      }

      addEnquiry({ variables: { inquiryDto } });
    }
  };

  const [getEnquiries, { loading: enquiriesLoading }] = useLazyQuery(SEARCH_IN_INQUIRY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setFeedbackData(data?.searchInquiry?.edges);
      }
    },
  });

  useEffect(() => {
    getEnquiries({ variables: { searchDto: {} } });
  }, []);

  const renderFeedbacks = (item) => {
    return (
      <View style={{ marginTop: RfH(24) }}>
        <Text style={commonStyles.mediumMutedText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScreenHeader label="Send Feedback" homeIcon lineVisible={false} />
      <View style={{ height: RfH(44) }} />
      <View>
        <Text style={commonStyles.smallMutedText}>Subject</Text>
        <Item>
          <Input value={query} onChangeText={(text) => setQuery(text)} />
        </Item>
      </View>
      <View style={{ height: RfH(24) }} />
      <View>
        <Text style={commonStyles.smallMutedText}>Type Message here</Text>
        <Item>
          <Textarea
            numberOfLines={10}
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={{ height: RfH(100), flex: 1 }}
          />
        </Item>
      </View>
      <View style={{ height: RfH(30) }} />
      <Button onPress={() => onAddingEnquiry()} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
        <Text style={commonStyles.textButtonPrimary}>Send Message</Text>
      </Button>
      {/* <View style={{ height: RfH(80) }} /> */}
      {/* <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Feedback History</Text> */}
      {/* <FlatList */}
      {/*  showsVerticalScrollIndicator={false} */}
      {/*  data={feedbackData} */}
      {/*  renderItem={({ item, index }) => renderFeedbacks(item, index)} */}
      {/*  keyExtractor={(item, index) => index.toString()} */}
      {/*  contentContainerStyle={{ paddingBottom: RfH(32) }} */}
      {/* /> */}
    </View>
  );
}

export default SendFeedback;
