/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, FlatList, Text } from 'react-native';
import { Images, Colors } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';

function customRangeSelector(props) {
  const [viewHeight, setViewHeight] = useState(height);
  const [selectedIndex, setSelectedIndex] = useState('');
  const { height, style, activeIndex, dataValue, submitFunction, label, minValue, maxValue } = props;

  const getViewHeight = () => {
    const iconsHeight = dataValue.length * 13 + 25;
    const vheight = (height - iconsHeight) / dataValue.length;
    setViewHeight(vheight);
  };

  const getIndex = () => {
    const selIndex = dataValue.findIndex((item) => item === activeIndex);
    setSelectedIndex(selIndex);
  };

  useEffect(() => {
    getViewHeight();
    getIndex();
  });

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => submitFunction(item, index)}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
          <View style={{ alignSelf: 'flex-start', marginRight: RfW(16), width: 100 }}>
            <Text
              style={
                index === selectedIndex
                  ? { textAlign: 'right', fontSize: 16, color: Colors.brandBlue2 }
                  : { textAlign: 'right' }
              }>
              {item}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            {index < selectedIndex ? (
              <View style={{ alignItems: 'center' }}>
                <IconButtonWrapper
                  iconWidth={RfW(13)}
                  iconHeight={RfH(13)}
                  iconImage={Images.small_active_blue}
                  styling={{ alignSelf: 'center' }}
                />
                <View
                  style={{ backgroundColor: Colors.brandBlue2, height: viewHeight, width: RfW(2), alignSelf: 'center' }}
                />
              </View>
            ) : index === selectedIndex ? (
              <View style={{ alignItems: 'center' }}>
                {index === dataValue.length - 1 ? (
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    iconImage={Images.active_blue_circle}
                    styling={{ alignSelf: 'center' }}
                  />
                ) : (
                  <View>
                    <IconButtonWrapper
                      iconWidth={RfW(25)}
                      iconHeight={RfH(25)}
                      iconImage={Images.active_blue_circle}
                      styling={{ alignSelf: 'center' }}
                    />
                    <View
                      style={{
                        backgroundColor: Colors.darkGrey,
                        height: viewHeight,
                        width: RfW(2),
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                {index !== selectedIndex && (
                  <View>
                    {index === dataValue.length - 1 ? (
                      <View
                        style={{
                          backgroundColor: Colors.darkGrey,
                          height: RfH(13),
                          width: RfW(13),
                          alignSelf: 'center',
                          borderRadius: RfH(6.5),
                        }}
                      />
                    ) : (
                      <View>
                        <View
                          style={{
                            backgroundColor: Colors.darkGrey,
                            height: RfH(13),
                            width: RfW(13),
                            alignSelf: 'center',
                            borderRadius: RfH(6.5),
                          }}
                        />
                        <View
                          style={{
                            backgroundColor: Colors.darkGrey,
                            height: viewHeight,
                            width: RfW(2),
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={{ width: RfW(50) }}>
            {maxValue && index === 0 ? (
              <View
                style={{
                  marginLeft: RfW(16),
                  height: RfH(20),
                  width: RfW(30),
                  borderRadius: RfH(11),
                  backgroundColor: Colors.orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {index === 0 && <Text style={{ fontSize: 10, textAlign: 'center' }}>{maxValue}</Text>}
              </View>
            ) : (
              <View />
            )}
            {minValue && index === dataValue.length - 1 ? (
              <View
                style={{
                  marginLeft: RfW(16),
                  height: RfH(20),
                  width: RfW(30),
                  borderRadius: RfH(11),
                  backgroundColor: Colors.orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {index === dataValue.length - 1 && (
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>{minValue}</Text>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ height, alignItems: 'flex-start' }}>
      <View style={{ marginBottom: RfH(16) }}>
        <Text>{label}</Text>
      </View>
      <FlatList
        data={dataValue}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

customRangeSelector.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  activeIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataValue: PropTypes.array,
  submitFunction: PropTypes.func,
  label: PropTypes.string,
  minValue: PropTypes.string,
  maxValue: PropTypes.string,
};

customRangeSelector.defaultProps = {
  height: RfH(100),
  style: {},
  activeIndex: null,
  dataValue: [0, 1],
  submitFunction: null,
  label: '',
  minValue: '',
  maxValue: '',
};

export default customRangeSelector;
