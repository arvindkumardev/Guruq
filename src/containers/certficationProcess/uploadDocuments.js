import { View, Text, TouchableWithoutFeedback, ScrollView, StatusBar, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Picker } from 'native-base';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { isArray, isStringEquals } from 'lodash';
import { configs } from 'eslint-plugin-prettier';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import CustomDatePicker from '../../components/CustomDatePicker';
import { GET_INTERVIEW_SCHEDULE_AVAILABILITY } from '../tutor/tutor.query';
import {
  ADD_INTERVIEW_DETAILS,
  DELETE_TUTOR_DOCUMENT_DETAILS,
  ADD_TUTOR_DOCUMENT_DETAILS,
} from '../tutor/tutor.mutation';
import { tutorDetails } from '../../apollo/cache';
import { InterviewMode, InterviewStatus } from '../tutor/enums';

function UploadDocuments() {
  const [interviewDate, setInterviewDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedId, setSelectedId] = useState(1);
  const [addressId, setAddressId] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [idProofDetails, setIdProofDetails] = useState('');
  const [addressProofDetails, setAddressProofDetails] = useState('');
  const [panCardDetails, setPanCardDetails] = useState('');
  const [qualificationDetails, setQualificationDetails] = useState('');

  const tutorInfo = useReactiveVar(tutorDetails);

  const DOCUMENT_NAME_ID_PROOF = 'id proof';
  const DOCUMENT_NAME_ADDRESS_PROOF = 'address proof';
  const DOCUMENT_NAME_PAN_CARD = 'pan card';
  const DOCUMENT_NAME_HIGHEST_QUALIFICATION = 'degree';

  const [availableTimes, setAvailableTimes] = useState([]);

  const [getInterviewAvailability, { loading: loadingAvailability }] = useLazyQuery(
    GET_INTERVIEW_SCHEDULE_AVAILABILITY,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        if (e.graphQLErrors && e.graphQLErrors.length > 0) {
          const error = e.graphQLErrors[0].extensions.exception.response;
        }
      },
      onCompleted: (data) => {
        if (data) {
          const times = [];
          data.getAvailabilityForInterview.map((obj) => {
            if (obj.active) {
              times.push(obj);
            }
          });
          setAvailableTimes(times);
          setSelectedTime(times[0]);
        }
      },
    }
  );

  const getAvailability = (value) => {
    setInterviewDate(value);
    getInterviewAvailability({
      variables: {
        availabilityDto: {
          startDate: moment.utc(new Date(value)).format('YYYY-MM-DD'),
          endDate: moment.utc(new Date(value)).add(1, 'day').format('YYYY-MM-DD'),
        },
      },
    });
  };

  const [addInterviewDetails, { loading: addEnquiryLoading }] = useMutation(ADD_INTERVIEW_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Interview scheduled!');
      }
    },
  });

  const onAddingDetails = () => {
    if (!selectedTime) {
      Alert.alert('Please select start time!');
    } else {
      addInterviewDetails({
        variables: {
          interviewDto: {
            startDate: selectedTime.startDate,
            endDate: selectedTime.endDate,
            status: InterviewStatus.SCHEDULED.label,
            mode: InterviewMode.ONLINE.label,
            tutor: {
              id: tutorInfo?.id,
            },
          },
        },
      });
    }
  };

  const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    if (isArray(documents)) {
      setIdProofDetails(documents.find((s) => isStringEquals(s.name, DOCUMENT_NAME_ID_PROOF)));
      setAddressProofDetails(documents.find((s) => isStringEquals(s.name, DOCUMENT_NAME_ADDRESS_PROOF)));
      setPanCardDetails(documents.find((s) => isStringEquals(s.name, DOCUMENT_NAME_PAN_CARD)));
      setQualificationDetails(documents.find((s) => isStringEquals(s.name, DOCUMENT_NAME_HIGHEST_QUALIFICATION)));
    }
  }, [documents]);

  const [deleteDocumentRequest, { loading: deleteDocumentLoading }] = useMutation(DELETE_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      //   const { errorCode } = e.graphQLErrors[0].extensions.exception.response;
      // }
      alert('Something went wrong! Please try again');
    },
    onCompleted(data) {
      onDelete({ documents: documents.filter((doc) => doc.id !== data.deleteDocumentDetail.id) });
    },
  });

  const [addDocumentRequest, { loading: addDocumentLoading }] = useMutation(ADD_TUTOR_DOCUMENT_DETAILS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
      // if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      //   const { errorCode } = e.graphQLErrors[0].extensions.exception.response;
      // }
      alert('Something went wrong! Please try again');
    },
    onCompleted(data) {
      if (data) {
        onAddOrUpdate({
          documents: [...documents, data.addUpdateDocumentDetail],
        });
        if (isStringEquals(data.addUpdateDocumentDetail.name, DOCUMENT_NAME_ID_PROOF)) {
          setIdProofDetails(data.addUpdateDocumentDetail);
        }
        if (isStringEquals(data.addUpdateDocumentDetail.name, DOCUMENT_NAME_ADDRESS_PROOF)) {
          setAddressProofDetails(data.addUpdateDocumentDetail);
        }
        if (isStringEquals(data.addUpdateDocumentDetail.name, DOCUMENT_NAME_PAN_CARD)) {
          setPanCardDetails(data.addUpdateDocumentDetail);
        }
        if (isStringEquals(data.addUpdateDocumentDetail.name, DOCUMENT_NAME_HIGHEST_QUALIFICATION)) {
          setQualificationDetails(data.addUpdateDocumentDetail);
        }
      }
    },
  });

  const handleAcceptedFiles = async (files, documentName) => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${localStorage.getItem(AUTH_TOKEN_LS_KEY)}`);
    const formdata = new FormData();
    formdata.append('file', files[0]);
    try {
      setIsFileUploading(true);
      const res = await fetch(`${config.restEndpoint}/upload/file`, {
        headers,
        method: 'POST',
        body: formdata,
      }).then((response) => response.json());
      setIsFileUploading(false);
      const ref = {};
      ref[referenceType.toLowerCase()] = { id: referenceId };
      const documentDto = {
        attachment: {
          name: files[0].name,
          type: res.type,
          filename: res.filename,
          size: res.size,
        },
        ...ref,
      };
      switch (documentName) {
        case DOCUMENT_NAME_ID_PROOF:
          documentDto.name = DOCUMENT_NAME_ID_PROOF;
          documentDto.type = idProofType;
          setIdProofDetails(documentDto);
          break;
        case DOCUMENT_NAME_ADDRESS_PROOF:
          documentDto.name = DOCUMENT_NAME_ADDRESS_PROOF;
          documentDto.type = addressProofType;
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
    } catch (error) {
      setIsFileUploading(false);
      console.log(error);
    }
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader label="Documents" horizontalPadding={RfW(8)} homeIcon />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: RfH(32) }}>
        <View style={{ padding: RfW(16), paddingBottom: RfH(16) }}>
          <View>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Documents</Text>
            <Text style={[commonStyles.mediumMutedText, { marginTop: RfH(8) }]}>
              Please Upload all the documents listed below
            </Text>
          </View>
          <View style={{ height: RfH(24) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Attach Documents</Text>
            <Text style={commonStyles.regularMutedText}>Click to upload</Text>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <Text>ID Proof</Text>
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <TouchableWithoutFeedback onPress={() => setSelectedId(1)}>
                <View style={commonStyles.horizontalChildrenView}>
                  <CustomRadioButton submitFunction={() => setSelectedId(1)} enabled={selectedId === 1} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setSelectedId(2)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setSelectedId(2)} enabled={selectedId === 2} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Driving license</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
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
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <Text>Address Proof</Text>
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <TouchableWithoutFeedback onPress={() => setAddressId(1)}>
                <View style={commonStyles.horizontalChildrenView}>
                  <CustomRadioButton submitFunction={() => setAddressId(1)} enabled={addressId === 1} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setAddressId(2)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setAddressId(2)} enabled={addressId === 2} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Voter ID</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setAddressId(3)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setAddressId(3)} enabled={addressId === 3} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Passport</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
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
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <View style={commonStyles.horizontalChildrenView}>
                <Text style={commonStyles.regularPrimaryText}>Pan card</Text>
              </View>
            </View>
            <View>
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
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <Text style={commonStyles.regularPrimaryText}>Highest Qualification</Text>
              <Text style={commonStyles.mediumPrimaryText}>(Degree/Marksheet)</Text>
            </View>
            <View>
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
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default UploadDocuments;
