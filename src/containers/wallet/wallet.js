import { FlatList, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../theme/styles';
import { printCurrency, printDateTime, RfH, RfW } from '../../utils/helpers';
import { Colors, Fonts } from '../../theme';
import { userDetails } from '../../apollo/cache';
import { Loader } from '../../components';
import { GET_MY_QPOINTS_BALANCE, SEARCH_QPOINTS_TRANSACTIONS } from '../common/graphql-query';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

function Wallet() {
  const isFocussed = useIsFocused();
  const [showHeader, setShowHeader] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [balanceData, setBalanceData] = useState({});

  const userInfo = useReactiveVar(userDetails);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollPosition > 30);
  };

  const [getMyQpointBalance, { loading: loadingPointsBalance }] = useLazyQuery(GET_MY_QPOINTS_BALANCE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        setBalanceData(data.getMyBalance);
      }
    },
  });

  const [getQPointsTransactions, { loading: loadingPointsTransactions }] = useLazyQuery(SEARCH_QPOINTS_TRANSACTIONS, {
    fetchPolicy: 'no-cache',
    variables: { searchDto: { userId: userInfo?.id, sortBy: 'createdDate', sortOrder: 'desc' } },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setTransactionData(data?.searchQPointTransaction?.edges);
      }
    },
  });

  useEffect(() => {
    if (isFocussed && userInfo) {
      getQPointsTransactions();
      getMyQpointBalance({ variables: { searchDto: { userId: userInfo?.id } } });
    }
  }, [isFocussed]);

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
        <View style={commonStyles.verticallyCenterItemsView}>
          <Text
            style={[
              commonStyles.headingPrimaryText,
              { fontFamily: Fonts.semiBold, fontSize: RFValue(34, STANDARD_SCREEN_SIZE) },
            ]}>
            {printCurrency(balanceData.balance)}
          </Text>
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Balance</Text>
        </View>

        <View style={commonStyles.verticallyCenterItemsView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {printCurrency(balanceData.earn)}
          </Text>
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Total Points</Text>
        </View>
        <View style={commonStyles.verticallyCenterItemsView}>
          <Text style={[commonStyles.regularPrimaryText, { color: Colors.orangeRed, fontFamily: Fonts.semiBold }]}>
            {printCurrency(balanceData.redeem)}
          </Text>
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(8) }]}>Points Redeemed</Text>
        </View>
      </View>
    );
  };

  const renderItems = (item) => {
    return (
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.pointType.title}</Text>
          <Text
            style={[
              commonStyles.regularPrimaryText,
              {
                fontFamily: Fonts.bold,
                color: item.pointType.actionType === 'EARN' ? Colors.primaryText : Colors.orangeRed,
              },
            ]}>
            {item.pointType.actionType === 'EARN' ? '+' : ''}
            {item.points}
          </Text>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(4) }]}>
          <Text style={commonStyles.mediumMutedText}>{printDateTime(item.createdDate)}</Text>
          {/* <Text */}
          {/*  style={[ */}
          {/*    commonStyles.mediumMutedText, */}
          {/*    { color: item.pointType.actionType === 'EARN' ? Colors.brandBlue2 : Colors.orangeRed }, */}
          {/*  ]}> */}
          {/*  {item.pointType.actionType === 'EARN' ? 'Earn' : 'Redeem'} */}
          {/* </Text> */}
        </View>
        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(24) }]} />
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={loadingPointsTransactions || loadingPointsBalance} />
      <View style={{ height: RfH(44), marginHorizontal: RfW(16), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && <Text style={commonStyles.headingPrimaryText}>My Q-Points</Text>}
      </View>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => handleScroll(event)}
          scrollEventThrottle={16}
          scrollEnabled={transactionData.length > 0}>
          <Text style={[commonStyles.pageTitleThirdRow, { marginHorizontal: RfW(16) }]}>My Q-Points</Text>

          {renderBalanceView()}

          <View
            style={[commonStyles.horizontalChildrenSpaceView, { backgroundColor: Colors.lightGrey, padding: RfW(16) }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>My Activity</Text>
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
export default Wallet;
