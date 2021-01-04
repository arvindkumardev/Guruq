import { ScrollView, StatusBar, Text, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { isArray, isEmpty } from 'lodash';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Images } from '../../theme';
import { alertBox, getToken, RfH, RfW } from '../../utils/helpers';
import { ADD_TUTOR_DOCUMENT_DETAILS, DELETE_TUTOR_DOCUMENT_DETAILS } from '../tutor/tutor.mutation';
import UploadDocument from '../../components/UploadDocument';
import { GET_TUTOR_ALL_DETAILS } from './certification-query';
import { DocumentTypeEnum } from '../common/enums';
import Loader from '../../components/Loader';

const DOCUMENT_NAME_ID_PROOF = 'id proof';
const DOCUMENT_NAME_ADDRESS_PROOF = 'address proof';
const DOCUMENT_NAME_PAN_CARD = 'pan card';
const DOCUMENT_NAME_HIGHEST_QUALIFICATION = 'degree';

function UploadDocuments() {
  const [selectedId, setSelectedId] = useState('AADHAAR_CARD');
  const [addressId, setAddressId] = useState('AADHAAR_CARD');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [idProofDetails, setIdProofDetails] = useState('');
  const [addressProofDetails, setAddressProofDetails] = useState('');
  const [panCardDetails, setPanCardDetails] = useState('');
  const [qualificationDetails, setQualificationDetails] = useState('');
  const [tutorDetail, setTutorDetail] = useState({});

  const [token, setToken] = useState();
  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  const [getTutorDetails, { loading: tutorLeadDetailLoading }] = useLazyQuery(GET_TUTOR_ALL_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTutorDetail(data.getTutorDetails);
        setDocuments(data.getTutorDetails.documents);
      }
    },
  });

  const [deleteDocumentRequest, { loading: deleteDocumentLoading }] = useMutation(DELETE_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      getTutorDetails();
    },
  });

  const handleDelete = (id) => {
    alertBox(`Do you really want to delete`, '', {
      positiveText: 'Yes',
      onPositiveClick: () => deleteDocumentRequest({ variables: { id } }),
      negativeText: 'No',
    });
  };

  const [addDocumentRequest, { loading: addDocumentLoading }] = useMutation(ADD_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data) {
        if (data.addUpdateDocumentDetail.name === DOCUMENT_NAME_ID_PROOF) {
          setIdProofDetails(data.addUpdateDocumentDetail);
        }
        if (data.addUpdateDocumentDetail.name === DOCUMENT_NAME_ADDRESS_PROOF) {
          setAddressProofDetails(data.addUpdateDocumentDetail);
        }
        if (data.addUpdateDocumentDetail.name === DOCUMENT_NAME_PAN_CARD) {
          setPanCardDetails(data.addUpdateDocumentDetail);
        }
        if (data.addUpdateDocumentDetail.name === DOCUMENT_NAME_HIGHEST_QUALIFICATION) {
          setQualificationDetails(data.addUpdateDocumentDetail);
        }
      }
    },
  });

  useEffect(() => {
    getTutorDetails();
  }, []);

  useEffect(() => {
    if (isArray(documents)) {
      setIdProofDetails(documents.find((s) => s.name === DOCUMENT_NAME_ID_PROOF));
      setAddressProofDetails(documents.find((s) => s.name === DOCUMENT_NAME_ADDRESS_PROOF));
      setPanCardDetails(documents.find((s) => s.name === DOCUMENT_NAME_PAN_CARD));
      setQualificationDetails(documents.find((s) => s.name === DOCUMENT_NAME_HIGHEST_QUALIFICATION));
    }
  }, [documents]);

  useEffect(() => {
    if (!isEmpty(addressProofDetails)) {
      setAddressId(addressProofDetails.type);
    }
  }, [addressProofDetails]);

  useEffect(() => {
    if (!isEmpty(idProofDetails)) {
      setSelectedId(idProofDetails.type);
    }
  }, [idProofDetails]);

  const handleAcceptedFiles = async (file) => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', `multipart/form-data`);
    const formdata = new FormData();
    formdata.append('file', file);
    setIsFileUploading(true);
    try {
      const res = await fetch(`http://apiv2.guruq.in/api/upload/file`, {
        headers,
        method: 'POST',
        body: formdata,
      }).then((response) => response.json());

      const documentDto = {
        attachment: {
          name: file.filename,
          type: res.type,
          filename: res.filename,
          size: res.size,
        },
        tutor: {
          id: tutorDetail.id,
        },
      };

      switch (selectedDoc) {
        case DOCUMENT_NAME_ID_PROOF:
          documentDto.name = DOCUMENT_NAME_ID_PROOF;
          documentDto.type = selectedId;
          setIdProofDetails(documentDto);
          break;
        case DOCUMENT_NAME_ADDRESS_PROOF:
          documentDto.name = DOCUMENT_NAME_ADDRESS_PROOF;
          documentDto.type = addressId;
          setAddressProofDetails(documentDto);
          break;
        case DOCUMENT_NAME_PAN_CARD:
          documentDto.name = DOCUMENT_NAME_PAN_CARD;
          documentDto.type = DocumentTypeEnum.PAN_CARD.label;
          setPanCardDetails(documentDto);
          break;
        case DOCUMENT_NAME_HIGHEST_QUALIFICATION:
          documentDto.name = DOCUMENT_NAME_HIGHEST_QUALIFICATION;
          documentDto.type = DocumentTypeEnum.OTHER.label;
          setQualificationDetails(documentDto);
          break;
        default:
          documentDto.type = null;
          break;
      }
      if (documentDto.type) {
        addDocumentRequest({ variables: { documentDto } });
      }
      setIsFileUploading(false);
    } catch (error) {
      setIsFileUploading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Loader isLoading={isFileUploading || deleteDocumentLoading || addDocumentLoading || tutorLeadDetailLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader label="Documents" horizontalPadding={RfW(8)} homeIcon />
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: RfH(32) }}>
          <View style={{ padding: RfW(16), paddingBottom: RfH(16) }}>
            <View>
              <Text style={[commonStyles.mediumMutedText, { marginTop: RfH(8) }]}>
                Please Upload all the documents listed below
              </Text>
            </View>
            <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
            <Text>ID Proof</Text>
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View>
                <TouchableWithoutFeedback onPress={() => setSelectedId('AADHAAR_CARD')}>
                  <View style={commonStyles.horizontalChildrenView}>
                    <CustomRadioButton
                      submitFunction={() => setSelectedId('AADHAAR_CARD')}
                      enabled={selectedId === 'AADHAAR_CARD'}
                    />
                    <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setSelectedId('DRIVING_LICENSE')}>
                  <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                    <CustomRadioButton
                      submitFunction={() => setSelectedId('DRIVING_LICENSE')}
                      enabled={selectedId === 'DRIVING_LICENSE'}
                    />
                    <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Driving license</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {isEmpty(idProofDetails) && (
                <TouchableOpacity
                  onPress={() => {
                    setIsUploadModalOpen(true);
                    setSelectedDoc(DOCUMENT_NAME_ID_PROOF);
                  }}>
                  <View
                    style={{
                      padding: RfH(24),
                      borderRadius: RfH(8),
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: Colors.darkGrey,
                    }}>
                    <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                  </View>
                </TouchableOpacity>
              )}
              {!isEmpty(idProofDetails) && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButtonWrapper
                    iconWidth={RfW(72)}
                    iconHeight={RfH(72)}
                    styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                    imageResizeMode="cover"
                    iconImage={`http://apiv2.guruq.in/api/upload/${idProofDetails.attachment.filename}`}
                  />
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    imageResizeMode="cover"
                    iconImage={Images.delete}
                    submitFunction={() => handleDelete(idProofDetails.id)}
                  />
                </View>
              )}
            </View>
            <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
            <Text>Address Proof</Text>
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View>
                <TouchableWithoutFeedback onPress={() => setAddressId('AADHAAR_CARD')}>
                  <View style={commonStyles.horizontalChildrenView}>
                    <CustomRadioButton
                      submitFunction={() => setAddressId('AADHAAR_CARD')}
                      enabled={addressId === 'AADHAAR_CARD'}
                    />
                    <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setAddressId('VOTER_ID')}>
                  <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                    <CustomRadioButton
                      submitFunction={() => setAddressId('VOTER_ID')}
                      enabled={addressId === 'VOTER_ID'}
                    />
                    <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Voter ID</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setAddressId('PASSPORT')}>
                  <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                    <CustomRadioButton
                      submitFunction={() => setAddressId('PASSPORT')}
                      enabled={addressId === 'PASSPORT'}
                    />
                    <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Passport</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {isEmpty(addressProofDetails) && (
                <TouchableOpacity
                  onPress={() => {
                    setIsUploadModalOpen(true);
                    setSelectedDoc(DOCUMENT_NAME_ADDRESS_PROOF);
                  }}>
                  <View
                    style={{
                      padding: RfH(24),
                      borderRadius: RfH(8),
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: Colors.darkGrey,
                    }}>
                    <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                  </View>
                </TouchableOpacity>
              )}

              {!isEmpty(addressProofDetails) && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButtonWrapper
                    iconWidth={RfW(72)}
                    iconHeight={RfH(72)}
                    styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                    imageResizeMode="cover"
                    iconImage={`http://apiv2.guruq.in/api/upload/${addressProofDetails.attachment.filename}`}
                  />
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    imageResizeMode="cover"
                    iconImage={Images.delete}
                    submitFunction={() => handleDelete(addressProofDetails.id)}
                  />
                </View>
              )}
            </View>
            <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View>
                <View style={commonStyles.horizontalChildrenView}>
                  <Text style={commonStyles.regularPrimaryText}>Pan card</Text>
                </View>
              </View>
              {isEmpty(panCardDetails) && (
                <TouchableOpacity
                  onPress={() => {
                    setIsUploadModalOpen(true);
                    setSelectedDoc(DOCUMENT_NAME_PAN_CARD);
                  }}>
                  <View
                    style={{
                      padding: RfH(24),
                      borderRadius: RfH(8),
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: Colors.darkGrey,
                    }}>
                    <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                  </View>
                </TouchableOpacity>
              )}
              {!isEmpty(panCardDetails) && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButtonWrapper
                    iconWidth={RfW(72)}
                    iconHeight={RfH(72)}
                    styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                    imageResizeMode="cover"
                    iconImage={`http://apiv2.guruq.in/api/upload/${panCardDetails.attachment.filename}`}
                  />
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    imageResizeMode="cover"
                    iconImage={Images.delete}
                    submitFunction={() => handleDelete(panCardDetails.id)}
                  />
                </View>
              )}
            </View>
            <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
            <View style={{ height: RfH(16) }} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View>
                <Text style={commonStyles.regularPrimaryText}>Highest Qualification</Text>
                <Text style={commonStyles.mediumPrimaryText}>(Degree/Marksheets)</Text>
              </View>
              {isEmpty(qualificationDetails) && (
                <TouchableOpacity
                  onPress={() => {
                    setIsUploadModalOpen(true);
                    setSelectedDoc(DOCUMENT_NAME_HIGHEST_QUALIFICATION);
                  }}>
                  <View
                    style={{
                      padding: RfH(24),
                      borderRadius: RfH(8),
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: Colors.darkGrey,
                    }}>
                    <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(24)} iconImage={Images.upload} />
                  </View>
                </TouchableOpacity>
              )}
              {!isEmpty(qualificationDetails) && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButtonWrapper
                    iconWidth={RfW(72)}
                    iconHeight={RfH(72)}
                    styling={{ borderRadius: RfH(8), marginRight: RfW(20) }}
                    imageResizeMode="cover"
                    iconImage={`http://apiv2.guruq.in/api/upload/${qualificationDetails.attachment.filename}`}
                  />
                  <IconButtonWrapper
                    iconWidth={RfW(25)}
                    iconHeight={RfH(25)}
                    imageResizeMode="cover"
                    iconImage={Images.delete}
                    submitFunction={() => handleDelete(qualificationDetails.id)}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <UploadDocument
          isVisible={isUploadModalOpen}
          handleClose={() => setIsUploadModalOpen(!isUploadModalOpen)}
          isFilePickerVisible
          handleUpload={handleAcceptedFiles}
          snapCount={1}
        />
      </View>
    </>
  );
}

export default UploadDocuments;
