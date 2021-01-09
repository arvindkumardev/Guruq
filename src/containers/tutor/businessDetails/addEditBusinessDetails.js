import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { isEmpty, omit } from 'lodash';
import { useMutation, useReactiveVar } from '@apollo/client';
import {
  CustomCheckBox,
  IconButtonWrapper,
  Loader,
  ScreenHeader,
  CustomModalDocumentViewer,
  UploadDocument,
} from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { alertBox, getToken, RfH, RfW } from '../../../utils/helpers';
import { ADD_UPDATE_BUSINESS_DETAILS } from './business.mutation';
import { tutorDetails } from '../../../apollo/cache';
import { ADD_TUTOR_DOCUMENT_DETAILS, DELETE_TUTOR_DOCUMENT_DETAILS } from '../tutor.mutation';
import { DocumentTypeEnum } from '../../common/enums';
import { ATTACHMENT_PREVIEW_URL } from '../../../utils/constants';

function AddEditBusinessDetails(props) {
  const businessDetail = props?.route?.params?.businessDetails;
  const navigation = useNavigation();
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [legalName, setLegalName] = useState('');
  const [panCardDoc, setPanCardDoc] = useState({});
  const [gstinDoc, setGstinDoc] = useState({});
  const [gstEligible, setGstEligible] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPanCardDoc, setIsPanCardDoc] = useState(true);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const tutorInfo = useReactiveVar(tutorDetails);
  const [viewDocument, setViewDocument] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});

  const [token, setToken] = useState();
  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(businessDetail)) {
      setPanCardDoc(businessDetail.panCard);
      setGstinDoc(businessDetail.gstCertificate);
      setPanNumber(businessDetail.panNumber);
      setGstNumber(businessDetail.gstNumber);
      setLegalName(businessDetail.businessName);
      setGstEligible(businessDetail.gstEligible);
    }
  }, [businessDetail]);

  const [saveBusinessDetail, { loading: saveBusinessLoading }] = useMutation(ADD_UPDATE_BUSINESS_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Business Details saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSubmitBusinessDetail = () => {
    if (isEmpty(panNumber)) {
      alertBox('Please provide the PAN number');
    } else if (isEmpty(panCardDoc)) {
      alertBox('Please upload the pan card');
    } else if (isEmpty(gstNumber) && gstEligible) {
      alertBox('Please provide the GST number');
    } else if (isEmpty(legalName) && gstEligible) {
      alertBox('Please provide the legal name');
    } else {
      saveBusinessDetail({
        variables: {
          businessDetailsDto: {
            panCard: { name: panCardDoc.name, attachment: omit(panCardDoc.attachment, ['__typename', 'original']) },
            panNumber,
            gstEligible,
            ...(gstEligible && {
              businessName: gstEligible ? legalName : '',
              gstNumber: gstEligible ? gstNumber : '',
              gstCertificate: gstEligible
                ? { name: gstinDoc.name, attachment: omit(gstinDoc.attachment, ['__typename', 'original']) }
                : {},
            }),
          },
        },
      });
    }
  };

  const [addDocumentRequest, { loading: addDocumentLoading }] = useMutation(ADD_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data) {
        if (isPanCardDoc) {
          setPanCardDoc(data.addUpdateDocumentDetail);
        } else {
          setGstinDoc(data.addUpdateDocumentDetail);
        }
      }
    },
  });

  const handleAcceptedFiles = async (file) => {
    setIsUploadModalOpen(false);
    setIsFileUploading(true);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', `multipart/form-data`);
    const formdata = new FormData();
    formdata.append('file', file);
    try {
      const res = await fetch(`http://apiv2.guruq.in/api/upload/file`, {
        headers,
        method: 'POST',
        body: formdata,
      }).then((response) => response.json());
      const documentDto = {
        attachment: {
          name: res.filename,
          type: res.type,
          filename: res.filename,
          size: res.size,
        },
        tutor: {
          id: tutorInfo.id,
        },
        name: isPanCardDoc ? 'Pan card' : 'Gstin',
        type: isPanCardDoc ? DocumentTypeEnum.PAN_CARD.label : DocumentTypeEnum.GST_CERTIFICATE.label,
      };

      addDocumentRequest({ variables: { documentDto } });
      setIsFileUploading(false);
    } catch (error) {
      setIsFileUploading(false);
      console.log('error', error);
    }
  };

  const [deleteDocumentRequest, { loading: deleteDocumentLoading }] = useMutation(DELETE_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (isPanCardDoc) {
        setPanCardDoc({});
      } else {
        setGstinDoc({});
      }
    },
  });

  const handleDelete = (id, isPanDoc) => {
    alertBox(`Do you really want to delete`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => {
        deleteDocumentRequest({ variables: { id } });
        setIsPanCardDoc(isPanDoc);
      },
      negativeText: 'No',
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ android: '', ios: 'padding' })}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? (isDisplayWithNotch() ? 44 : 20) : 0}
      enabled>
      <Loader isLoading={saveBusinessLoading || deleteDocumentLoading || isFileUploading || addDocumentLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Business Details" horizontalPadding={RfW(16)} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label style={commonStyles.regularMutedText}>PAN Number</Label>
            <Input value={panNumber} onChangeText={(text) => setPanNumber(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              Are you eligible for GST
            </Text>
            <CustomCheckBox enabled={gstEligible} submitFunction={() => setGstEligible(!gstEligible)} />
          </View>
          {gstEligible && (
            <>
              <View style={{ height: RfH(24) }} />
              <Item floatingLabel>
                <Label style={commonStyles.regularMutedText}>GSTIN</Label>
                <Input value={gstNumber} onChangeText={(text) => setGstNumber(text)} />
              </Item>
              <View style={{ height: RfH(24) }} />
              <View>
                <Item floatingLabel>
                  <Label style={commonStyles.regularMutedText}>Legal Name</Label>
                  <Input value={legalName} onChangeText={(text) => setLegalName(text)} />
                </Item>
              </View>
            </>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: RfH(24) }}>
            <View>
              <Text style={commonStyles.mediumMutedText}> Pan Card</Text>
              {isEmpty(panCardDoc) && (
                <TouchableOpacity
                  style={{
                    borderRadius: RfH(8),
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: Colors.darkGrey,
                    marginTop: RfH(10),
                    width: RfW(80),
                    height: RfH(80),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsUploadModalOpen(true);
                    setIsPanCardDoc(true);
                  }}>
                  <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                </TouchableOpacity>
              )}
              {!isEmpty(panCardDoc) && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RfH(10) }}>
                  <IconButtonWrapper
                    iconWidth={RfW(80)}
                    iconHeight={RfH(80)}
                    styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                    imageResizeMode="cover"
                    iconImage={
                      panCardDoc.attachment.type !== 'application/pdf'
                        ? `${ATTACHMENT_PREVIEW_URL}${panCardDoc.attachment.original}`
                        : Images.pdf
                    }
                    submitFunction={() => {
                      setViewDocument(true);
                      setSelectedDoc(panCardDoc);
                    }}
                  />
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    imageResizeMode="cover"
                    iconImage={Images.delete}
                    submitFunction={() => handleDelete(panCardDoc.id, true)}
                  />
                </View>
              )}
            </View>
            {gstEligible && (
              <View>
                <Text style={commonStyles.mediumMutedText}>GSTN Certificate</Text>
                {isEmpty(gstinDoc) && (
                  <TouchableOpacity
                    style={{
                      borderRadius: RfH(8),
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: Colors.darkGrey,
                      marginTop: RfH(10),
                      width: RfW(80),
                      height: RfH(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsUploadModalOpen(true);
                      setIsPanCardDoc(false);
                    }}>
                    <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                  </TouchableOpacity>
                )}

                {!isEmpty(gstinDoc) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RfH(10) }}>
                    <IconButtonWrapper
                      iconWidth={RfW(80)}
                      iconHeight={RfH(80)}
                      styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                      imageResizeMode="cover"
                      iconImage={
                        gstinDoc.attachment.type !== 'application/pdf'
                          ? `${ATTACHMENT_PREVIEW_URL}${gstinDoc.attachment.original}`
                          : Images.pdf
                      }
                      submitFunction={() => {
                        setViewDocument(true);
                        setSelectedDoc(gstinDoc);
                      }}
                    />
                    <IconButtonWrapper
                      iconWidth={RfW(25)}
                      iconHeight={RfH(25)}
                      imageResizeMode="cover"
                      iconImage={Images.delete}
                      submitFunction={() => handleDelete(gstinDoc.id, false)}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={{ height: RfH(44) }} />
          <View>
            <Button
              onPress={() => onSubmitBusinessDetail()}
              block
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
      {isUploadModalOpen && (
        <UploadDocument
          isVisible={isUploadModalOpen}
          handleClose={() => setIsUploadModalOpen(!isUploadModalOpen)}
          isFilePickerVisible
          handleUpload={handleAcceptedFiles}
          snapCount={1}
        />
      )}
      {viewDocument && !isEmpty(selectedDoc) && (
        <CustomModalDocumentViewer
          document={selectedDoc}
          modalVisible={viewDocument}
          backButtonHandler={() => setViewDocument(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

export default AddEditBusinessDetails;
