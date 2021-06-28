import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Dimensions, TouchableOpacity,Linking } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors, Images } from '../../../../theme';
import NavigationRouteNames from '../../../../routes/screenNames';
import CustomImage from '../../../../components/CustomImage';
import { IconButtonWrapper } from '../../../../components';
import { getDocumentFileUrl } from '../../../../utils/helpers';
import {GET_APP_CAROUSELS} from '../../../app.query'
import { useLazyQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { userToken } from '../../../../apollo/cache';
import { BannerTypeEnum } from '../../../../common/banner.enum';



const StudentTopCarousel = (props) => {
  const navigation = useNavigation();
 const isFocused = useIsFocused();
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselItems,setCarouselItems]=useState([])
const userTokenVal = useReactiveVar(userToken);
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);



  const [getAppCarousels, { loading: loadingCarousels }] =
    useLazyQuery(GET_APP_CAROUSELS, {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        console.log("Mangi:  App Carsousel error is=-======>",e);
      },
      onCompleted: (data) => {
        if (data) {
          console.log("Rohit: App Carsoule response is ",data)
          if(data.getAppCarousels.length>0)
          {
            setCarouselItems(data.getAppCarousels);
          }
        }
      },
    });

    useEffect(()=>{

      if(isFocused)
      {
          getAppCarousels();
      }

    },[isFocused])




    const handleBannerClick=async(bannerItem)=>{

      switch (bannerItem.targetScreenName) {
        case BannerTypeEnum.WEB_VIEW.label: {
             let url = null;
             bannerItem.payload.forEach((element) => {
               if ((element.key = 'url')) {
                 url = element.value;
               }
             }); 
             navigation.navigate(NavigationRouteNames.WEB_VIEW,{url:url})
          return;
        }
        case BannerTypeEnum.EXTERNAL_LINK.label: {
          let url=null;
          bannerItem.payload.forEach(element => {
            if(element.key="url")
            {
              url=element.value;
            }
          });  
          await Linking.openURL(url);
          return;
        }
        case BannerTypeEnum.COMPLETE_PROFILE.label: {
           navigation.navigate(NavigationRouteNames.STUDENT.PROFILE);
          return;
        }
        case BannerTypeEnum.REQUEST_HELP.label: {
            navigation.navigate(NavigationRouteNames.CUSTOMER_CARE);
          return;
        }
        case BannerTypeEnum.STUDENT_APPLY_COUPON.label: {
            // navigation.navigate(NavigationRouteNames.WEB_VIEW);
          return;
        }
        case BannerTypeEnum.STUDENT_RENEW_CLASS.label: {
           navigation.navigate(NavigationRouteNames.MY_CLASSES);
          return;
        }
        default:
          return;
      }

    }





    const renderCardItem=(item,index)=>{
    console.log("Mangi: Value of item is as follows ",item)
    console.log(
      'Mangi: value of attachment ',
      getDocumentFileUrl(item.attachment.original, userTokenVal),
  );
    return (
      <TouchableOpacity
        style={{
          width: ITEM_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handleBannerClick(item)}
        activeOpacity={0.8}>
        <IconButtonWrapper
          iconWidth={ITEM_WIDTH}
          iconHeight={ITEM_HEIGHT}
          styling={{ borderRadius: RfH(8) }}
          iconImage={getDocumentFileUrl(item.attachment.original, userTokenVal)}
        />
      </TouchableOpacity>
    );
  }

 
  
  return (
    <>
      <Carousel
        layout="default"
        data={carouselItems}
        renderItem={({ item, index }) => renderCardItem(item, index)}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setActiveSlide(index)}
        autoplay
        autoplayDelay={100}
        autoplayInterval={5000}
        loop
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
