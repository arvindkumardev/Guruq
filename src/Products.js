import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { gql, useQuery } from '@apollo/client';

const GET_ALL_USERS = gql`
  query {
    users {
      edges {
        id
        m_id
        firstName
        lastName
        mobile
        email
        isPhoneNumberVerified
        isEmailVerified
        isFirstTime
        lastLoginDate
        type
      }
    }
  }
`;
const itemsPerRow = 2;

const Products = (props) => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  const onPressItem = (item) => {
    console.log(item);
  };

  return (
    <>
      {loading && (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <View style={styles.container}>
              <Text>Loading....</Text>
            </View>
          </SafeAreaView>
        </>
      )}

      {error && (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <View style={styles.container}>
              <Text>
                `Error! $
                {error.message}
                `
              </Text>
            </View>
          </SafeAreaView>
        </>
      )}

      {!loading && !error && (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.mainContainer}>
            <FlatList
              data={data.users.edges}
              dataSource={null}
              numColumns={itemsPerRow}
              renderItem={(item, index) => {
                console.log(item.id);
                return <GridItem item={item.item} onPressItem={onPressItem} />;
              }}
            />
          </SafeAreaView>
        </>
      )}
    </>
  );
};

class GridItem extends React.PureComponent {
  _onPress = (item) => {
    this.props.onPressItem(item);
  };

  render() {
    const { item } = this.props;
    console.log(`safdfdf${item.email}`, item.mobile);
    StatusBar.setBarStyle('light-content', true);
    return (
      <TouchableHighlight
        style={styles.flatlistView}
        onPress={() => this._onPress(item)}
        underlayColor="#dddddd"
      >
        <View style={styles.flatlistView}>
          {/* <Image */}
          {/*  style={styles.image} */}
          {/*  source={{uri: item.featured_imageConnection.edges[0].node.url}} */}
          {/* /> */}
          <Text numberOfLines={1} style={styles.name}>
            {item.firstName}
            {' '}
            {item.lastName}
          </Text>
          <Text numberOfLines={2} style={styles.price}>
            {item.email}
            {' '}
            {item.modile}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  image: {
    alignContent: 'center', flex: 0.8, width: 170, height: 170
  },
  flatlistView: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    paddingTop: 5,
    paddingBottom: 5,
    paddingEnd: 2,
    paddingLeft: 2,
    borderRadius: 2,
  },
  price: {
    flex: 0.1,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 12,
    alignContent: 'center',
  },
  name: {
    flex: 0.1,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 15,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Products;
