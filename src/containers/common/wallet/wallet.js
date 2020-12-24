/* eslint-disable react/no-typos */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { ScrollView, Text, View, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import PropTypes from 'prop-types';
import ProgressCircle from 'react-native-progress-circle';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../../../theme/styles';
import { formatDate, printDateTime, RfH, RfW } from '../../../utils/helpers';
import { Colors, Fonts, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { userDetails } from '../../../apollo/cache';
import { IconButtonWrapper } from '../../../components';
import { SEARCH_QPOINTS_TRANSACTIONS } from '../graphql-query';

function Wallet(props) {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const { changeTab } = props;

  const userInfo = useReactiveVar(userDetails);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollPosition > 30);
  };

  const [getQPointsTransactions, { loading: loadingPointsTransactions }] = useLazyQuery(SEARCH_QPOINTS_TRANSACTIONS, {
    fetchPolicy: 'no-cache',
    variables: { searchDto: { userId: userInfo?.id } },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTransactionData(data?.searchQPointTransaction?.edges);
      }
    },
  });

  useEffect(() => {
    getQPointsTransactions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getQPointsTransactions();
    }, [])
  );

  const renderBalanceView = () => {
    return (
      <View
        style={[
          commonStyles.horizontalChildrenEqualSpaceView,
          {
            marginVertical: RfH(16),
            backgroundColor: Colors.lightPurple,
            padding: RfH(16),
            borderRadius: RfH(8),
            marginHorizontal: RfW(16),
          },
        ]}>
        <ProgressCircle
          percent={70}
          radius={32}
          borderWidth={6}
          color={Colors.brandBlue2}
          shadowColor={Colors.lightGrey}
          outerCircleStyle={{ backgroundColor: Colors.lightGrey }}
          bgColor={Colors.lightPurple}
        />
        <View style={commonStyles.verticallyCenterItemsView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            ₹ {parseFloat(userInfo.qPoints).toFixed(2)}
          </Text>
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Total Income</Text>
        </View>
        <View style={commonStyles.verticallyCenterItemsView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            ₹ {parseFloat(userInfo.qPoints).toFixed(2)}
          </Text>
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Expenditure</Text>
        </View>
      </View>
    );
  };

  const renderItems = (item) => {
    return (
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.pointType.title}</Text>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.bold }]}>
            {item.pointType.actionType === 'EARN' ? '+' : '-'} {item.points}
          </Text>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(4) }]}>
          <Text style={commonStyles.mediumMutedText}>{printDateTime(item.createdDate)}</Text>
          <Text
            style={[
              commonStyles.mediumMutedText,
              { color: item.pointType.actionType === 'EARN' ? Colors.brandBlue2 : Colors.orangeRed },
            ]}>
            {item.pointType.actionType === 'EARN' ? 'Earn' : 'Redeemed'}
          </Text>
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(24) }]} />
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <View style={{ height: RfH(44), marginHorizontal: RfW(16), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && <Text style={commonStyles.headingPrimaryText}>My Wallet</Text>}
      </View>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => handleScroll(event)}
          scrollEventThrottle={16}>
          <Text style={[commonStyles.pageTitleThirdRow, { marginHorizontal: RfW(16) }]}>My Wallet</Text>
          {/* <View style={{ height: RfH(44) }} />
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: RfH(8), marginHorizontal: RfW(16) },
            ]}>
            <Text>Balance</Text>
            <Text
              style={{
                fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                color: Colors.brandBlue2,
              }}>
              ₹ 300.00
            </Text>
          </View> */}
          {/* <View style={[commonStyles.horizontalChildrenView]}>
            {/* <IconButtonWrapper iconWidth={RfH(21)} iconHeight={RfH(21)} iconImage={Images.coin} /> */}
          {/* <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>1 Q point = 1 INR</Text> */}

          {/* </View> */}

          {renderBalanceView()}

          {/* <View style={[commonStyles.horizontalChildrenSpaceView, { marginHorizontal: RfW(16) }]}>
            <View
              style={[
                commonStyles.verticallyCenterItemsView,
                {
                  flex: 0.5,
                  backgroundColor: Colors.lightGreen,
                  padding: RfH(8),
                  borderRadius: RfH(8),
                  marginRight: RfW(4),
                },
              ]}>
              <Image source={Images.activities} />
              <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8), fontFamily: Fonts.semiBold }]}>
                My Activities
              </Text>
            </View>
            <View
              style={[
                commonStyles.verticallyCenterItemsView,
                {
                  flex: 0.5,
                  backgroundColor: Colors.lightOrange,
                  padding: RfH(8),
                  borderRadius: RfH(8),
                  marginLeft: RfW(4),
                },
              ]}>
              <Image source={Images.earn} />
              <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(8), fontFamily: Fonts.semiBold }]}>
                Earn More
              </Text>
            </View>
          </View> */}
          {/* <View style={{ height: RfH(16) }} /> */}

          <View
            style={[commonStyles.horizontalChildrenSpaceView, { backgroundColor: Colors.lightGrey, padding: RfW(16) }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Transaction history</Text>
            {/* <Text style={[commonStyles.smallPrimaryText, { color: Colors.brandBlue2 }]}>View All</Text> */}
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={transactionData}
            contentContainerStyle={{ paddingTop: RfH(24) }}
            renderItem={({ item, index }) => renderItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<View style={{ height: RfH(80) }} />}
          />
        </ScrollView>
      </View>
    </View>
  );
}

Wallet.propTypes = {
  changeTab: PropTypes.func,
};

Wallet.defaultProps = {
  changeTab: null,
};

export default Wallet;
