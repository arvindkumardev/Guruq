import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import Fonts from '../../../../theme/fonts';
import styles from '../styles';

function PriceMatrixComponent(props) {
  const { budgets, showOnline, showOffline } = props;
  const [priceMatrix, setPriceMatrix] = useState([]);
  useEffect(() => {
    if (!isEmpty(budgets)) {
      const pm = {
        online: { c1: 0, c5: 0, c10: 0, c25: 0, c50: 0 },
        offline: { c1: 0, c5: 0, c10: 0, c25: 0, c50: 0 },
      };
      const demoPrice = {
        online: 0,
        offline: 0,
      };
      budgets.forEach((budget) => {
        if (budget.demo) {
          demoPrice[budget.onlineClass ? 'online' : 'offline'] = budget.price;
        } else {
          pm[budget.onlineClass ? 'online' : 'offline'][`c${budget.count}`] = budget.price;
        }
      });

      let maxValue = 0;
      Object.entries(pm.online).forEach(([key, value]) => {
        if (value !== 0) {
          maxValue = value;
        } else {
          pm.online[key] = maxValue;
        }
      });

      maxValue = 0;
      Object.entries(pm.offline).forEach(([key, value]) => {
        if (value !== 0) {
          maxValue = value;
        } else {
          pm.offline[key] = maxValue;
        }
      });
      setPriceMatrix(pm);
    }
  }, [budgets]);
  return (
    <>
      {!isEmpty(priceMatrix) && (
        <View style={{ paddingVertical: RfW(16) }}>
          <View>
            <Text style={[commonStyles.headingPrimaryText]}>Price Matrix <Text style={commonStyles.regularMutedText}> (price/class)</Text></Text>
          </View>
          <View
            style={[
              commonStyles.horizontalChildrenCenterView,
              {
                marginTop: RfH(16),
                fontFamily: Fonts.semiBold,
              },
            ]}>
            <View style={{ flex: 0.25 }}>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold }]}>Classes</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 0.75,
              }}>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2, textAlign: 'center' }]}>1-4</Text>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2, textAlign: 'center' }]}>
                5-9
              </Text>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2, textAlign: 'center' }]}>
                10-24
              </Text>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2, textAlign: 'center' }]}>
                25-50
              </Text>
              <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2, textAlign: 'center' }]}>
                {'> 50'}
              </Text>
            </View>
          </View>
          {!showOnline ? (
            <View />
          ) : (
            <View
              style={[
                commonStyles.horizontalChildrenSpaceView,
                {
                  marginTop: RfH(16),
                },
              ]}>
              <View style={{ flex: 0.25 }}>
                <Text style={styles.tutorDetails}>Online Class</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 0.75,
                }}>
                {Object.entries(priceMatrix.online).map(([key, value]) => (
                  <Text style={[styles.tutorDetails, { flex: 0.2, textAlign: 'center' }]}>{value}</Text>
                ))}
              </View>
            </View>
          )}
          {!showOffline ? (
            <View />
          ) : (
            <View
              style={[
                commonStyles.horizontalChildrenSpaceView,
                {
                  marginTop: RfH(16),
                },
              ]}>
              <View style={{ flex: 0.25 }}>
                <Text style={styles.tutorDetails}>Home Tuition</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 0.75,
                }}>
                {Object.entries(priceMatrix.offline).map(([key, value]) => (
                  <Text style={[styles.tutorDetails, { flex: 0.2, textAlign: 'center' }]}>{value}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
}

export default PriceMatrixComponent;
