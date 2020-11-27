import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';

function ratings(props) {
  const { containerStyle, textStyle, ratings } = props;
  const [ratingStars, setRatingStars] = useState([]);

  useState(() => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= ratings) {
        arr.push(Images.star_orange);
      } else if (i > ratings && i < ratings + 1) {
        arr.push(Images.star_half_orange);
      } else {
        arr.push(Images.grey_star);
      }
    }
    setRatingStars(arr);
  });

  return (
    <View>
      <View style={containerStyle}>
        <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={ratingStars[0]} />
        <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={ratingStars[1]} />
        <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={ratingStars[2]} />
        <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={ratingStars[3]} />
        <IconButtonWrapper iconHeight={RfH(23)} iconWidth={RfW(23)} iconImage={ratingStars[4]} />
        <Text style={textStyle}>{parseFloat(ratings).toFixed(1)}</Text>
      </View>
    </View>
  );
}

ratings.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ratings: PropTypes.number,
};

ratings.defaultProps = {
  containerStyle: {},
  textStyle: {},
  ratings: 0,
};

export default ratings;
