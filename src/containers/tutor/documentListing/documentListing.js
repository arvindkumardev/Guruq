import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import { printDate, RfH, RfW } from '../../../utils/helpers';
import { GET_TUTOR_DOCUMENT_DETAILS } from '../businessDetails/business.query';
import CustomModalDocumentViewer from '../../../components/CustomModalDocumentViewer';

function DocumentListing() {
  const isFocussed = useIsFocused();
  const [list, setList] = useState([]);
  const [viewDocument, setViewDocument] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});

  const [getDocumentDetails, { loading: documentLoading }] = useLazyQuery(GET_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
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

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={() => {
        setViewDocument(true);
        setSelectedDoc(item);
      }}
      activeOpacity={0.8}>
      <View style={[commonStyles.horizontalChildrenView, { padding: RfH(16) }]}>
        <IconButtonWrapper
          iconImage={item.attachment.type === 'application/pdf' ? Images.pdf : Images.jpg}
          iconHeight={RfH(45)}
          iconWidth={RfH(45)}
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item?.name}</Text>
          <Text style={commonStyles.mediumMutedText}>{Math.round(item?.attachment?.size / 1000)}KB</Text>
        </View>
        <Text style={commonStyles.mediumMutedText}>{printDate(item?.createdDate)}</Text>
      </View>
      <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
    </TouchableOpacity>
  );

  return (
    <>
      <Loader isLoading={documentLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, flex: 1, paddingHorizontal: 0 }]}>
        <ScreenHeader label="Documents" homeIcon horizontalPadding={RfW(16)} />
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
    </>
  );
}

export default DocumentListing;
