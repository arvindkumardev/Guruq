import { Text, View, StatusBar, Switch, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Thumbnail } from 'native-base';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './styles';
import { IconButtonWrapper } from '../../../components';

function Tutor() {
  const [isTutor, setIsTutor] = useState(true);
  const [tutorData, setTutorData] = useState([
    {
      name: 'Ritesh Jain',
      qualification: 'Commerce Stream',
      imageUrl: Images.kushal,
      experience: 3,
      rating: 4.5,
      charge: '₹ 150/Hr',
    },
    {
      name: 'Simran Rai',
      qualification: 'B.tech',
      imageUrl: Images.user,
      experience: 2,
      rating: 4,
      charge: '₹ 250/Hr',
    },
    {
      name: 'Priyam',
      qualification: 'Mass Communication',
      imageUrl: Images.kushal,
      experience: 5,
      rating: 3,
      charge: '₹ 350/Hr',
    },
    {
      name: 'Ritesh Jain',
      qualification: 'Commerce Stream',
      imageUrl: Images.kushal,
      experience: 3,
      rating: 4.5,
      charge: '₹ 150/Hr',
    },
    {
      name: 'Simran Rai',
      qualification: 'B.tech',
      imageUrl: Images.user,
      experience: 2,
      rating: 4,
      charge: '₹ 250/Hr',
    },
    {
      name: 'Priyam',
      qualification: 'Mass Communication',
      imageUrl: Images.kushal,
      experience: 5,
      rating: 3,
      charge: '₹ 350/Hr',
    },
  ]);

  const renderItem = (item) => {
    return (
      <View style={styles.listItemParent}>
        <View style={styles.deatilsParent}>
          <View style={styles.userIconParent}>
            <Thumbnail square style={styles.userIcon} source={item.imageUrl} />
          </View>
          <View style={[styles.subjectTitleView, { flex: 0.7 }]}>
            <Text style={styles.tutorName}>{item.name}</Text>
            <Text style={styles.tutorDetails}>{item.qualification}</Text>
            <Text style={styles.tutorDetails}>{item.experience} years of Experience</Text>
            <View style={styles.iconsView}>
              <Text style={styles.chargeText}>{item.rating}</Text>
              <Text style={styles.chargeText}>{item.charge}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightPurple} />
      <View style={styles.topView}>
        <IconButtonWrapper styling={styles.bookIcon} iconImage={Images.book} />
      </View>
      <View style={styles.switchView}>
        <Text style={styles.switchText}>TUTORS</Text>
        <Switch onValueChange={() => setIsTutor(!isTutor)} value={isTutor} />
        <Text style={styles.switchText}>INSTITUTES</Text>
      </View>
      <View style={{ marginTop: RfH(8) }}>
        <View style={styles.subjectTitleView}>
          <Text style={styles.subjectTitle}>English Tutors</Text>
          <Text style={styles.classText}>CBSE I Class 9</Text>
          <View style={styles.filterParentView}>
            <Text style={styles.filterText}>20 TUTORS</Text>
            <Text style={styles.filterText}>Filters</Text>
          </View>
        </View>
      </View>
      <View>
        <FlatList
          data={tutorData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default Tutor;
