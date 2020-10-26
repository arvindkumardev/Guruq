import { Image, Text, View } from 'react-native';
import React from 'react';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { Thumbnail } from 'native-base';
import IconWrapper from '../../../../components/IconWrapper'

function profile() {

  return (
    <View style={commonStyles.mainContainer}>
      <Text style={{marginTop:RfH(48), fontSize:20, fontWeight:'bold'}}>
        My Profile
      </Text>
      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'stretch', marginTop:RfH(24)}}>
        <Image style={{height:RfH(82), width:RfW(82), borderRadius:8}} source={Images.user} />
        <View style={{flexDirection:'column', justifyContent:'flex-start', alignItems:'stretch'}}>
          <Text style={{marginTop:RfH(8), marginLeft:RfW(12), fontSize:18, fontWeight:'600', color:'rgb(25,24,24)'}}>Sheena Jain</Text>
          <Text style={{marginLeft:RfW(12), marginTop:RfH(2), color:'rgb(129,129,129)'}}>+91-9876543210</Text>
          <Text style={{marginLeft:RfW(12), color:'rgb(129,129,129)'}}>GURUQS21223I</Text>
        </View>
      </View>
      <View style={{flex:1, borderBottomColor:Colors.inputLabel, borderBottomWidth:0.5, marginTop:RfH(16)}}></View>
      <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', marginTop:RfH(16)}}>
        <View style={{flex:0.25, flexDirection:'column', justifyContent:'center', alignItems:"center"}}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.heart}/>
          <Text style={{fontSize:12, color:Colors.inputLabel, marginTop:RfH(8)}}>Favourites</Text>
        </View>
        <View style={{flex:0.25, flexDirection:'column', justifyContent:'center', alignItems:"center"}}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.bell}/>
          <Text style={{fontSize:12, color:Colors.inputLabel, marginTop:RfH(8)}}>Notification</Text>
        </View>
        <View style={{flex:0.25, flexDirection:'column', justifyContent:'center', alignItems:"center"}}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.qpoint}/>
          <Text style={{fontSize:12, color:Colors.inputLabel, marginTop:RfH(8)}}>Q Points</Text>
        </View>
        <View style={{flex:0.25, flexDirection:'column', justifyContent:'center', alignItems:"center"}}>
          <IconWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.cart}/>
          <Text style={{fontSize:12, color:Colors.inputLabel, marginTop:RfH(8)}}>Cart</Text>
        </View>
      </View>
      <View style={{flex:1, borderBottomColor:Colors.inputLabel, borderBottomWidth:0.5, marginTop:RfH(16)}}></View>
    </View>
  );
}

export default profile;
