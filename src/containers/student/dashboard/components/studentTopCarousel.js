import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors, Images } from '../../../../theme';
import NavigationRouteNames from '../../../../routes/screenNames';
import CustomImage from '../../../../components/CustomImage';

const carouselItems = [
  {
    image: Images.student_home_banner_1,
    routeName: NavigationRouteNames.MY_CLASSES,
    params: { tab: '' },
  },
  {
    image: Images.student_home_banner_2,
    routeName: NavigationRouteNames.CUSTOMER_CARE,
    params: {},
  },
  {
    image: Images.student_home_banner_3,
    routeName: NavigationRouteNames.MY_CLASSES,
    params: { tab: 'history' },
  },
];

const StudentTopCarousel = (props) => {
  const navigation = useNavigation();

  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);

  const renderCardItem = (item) => (
    <TouchableOpacity
      style={{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center' }}
      onPress={() => navigation.navigate(item.routeName, item.params)}
      activeOpacity={0.8}>
      <CustomImage
        image={item.image}
        imageWidth={ITEM_WIDTH}
        imageHeight={ITEM_HEIGHT}
        imageResizeMode="contain"
        styling={{ borderRadius: RfW(3) }}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <Carousel
        layout="default"
        data={carouselItems}
        renderItem={({ item, index }) => renderCardItem(item, index)}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setActiveSlide(index)}
        // autoplay
        // autoplayDelay={100}
        // autoplayInterval={5000}
        // loop
      />
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeSlide}
        containerStyle={{ paddingVertical: RfH(4) }}
        dotStyle={{
          width: RfH(10),
          height: RfH(10),
          borderRadius: RfH(5),
          marginHorizontal: RfW(1),
          backgroundColor: Colors.brandBlue2,
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </>
  );
};

StudentTopCarousel.propTypes = {};

export default StudentTopCarousel;
