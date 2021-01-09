import { FlatList, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import { printDate, RfH, RfW } from '../../../utils/helpers';
import { tutorDetails } from '../../../apollo/cache';
import { GET_TUTOR_DOCUMENT_DETAILS } from './business.query';
import CustomModalDocumentViewer from '../../../components/CustomModalDocumentViewer';

function DocumentListing() {
  const tutorInfo = useReactiveVar(tutorDetails);
  const isFocussed = useIsFocused();
  const [list, setList] = useState([]);
  const [viewDocument, setViewDocument] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});

  const [getDocumentDetails, { loading: documentLoading }] = useLazyQuery(GET_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setList(data.getTutorDocumentDetails.documents);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      getDocumentDetails();
    }
  }, [isFocussed]);

  const renderItem = (item) => {
    return (
      <View>
        <View style={[commonStyles.horizontalChildrenView, { padding: RfH(16) }]}>
          <IconButtonWrapper
            iconImage={item.attachment.type === 'application/pdf' ? Images.pdf : Images.jpg}
            iconHeight={RfH(45)}
            iconWidth={RfH(45)}
            submitFunction={() => {
              setViewDocument(true);
              setSelectedDoc(item);
            }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item?.name}</Text>
            <Text style={commonStyles.mediumMutedText}>{Math.round(item?.attachment?.size / 1000)}KB</Text>
          </View>
          <Text style={commonStyles.mediumMutedText}>{printDate(item?.createdDate)}</Text>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, flex: 1, paddingHorizontal: 0 }]}>
      <ScreenHeader
        label="Documents"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.searchIcon}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
      {viewDocument && !isEmpty(selectedDoc) && (
        <CustomModalDocumentViewer
          document={selectedDoc}
          modalVisible={viewDocument}
          backButtonHandler={() => setViewDocument(false)}
        />
      )}
    </View>
  );
}

export default DocumentListing;
