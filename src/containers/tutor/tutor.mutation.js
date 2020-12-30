import { gql } from '@apollo/client';

export const CREATE_UPDATE_TUTOR_OFFERINGS = gql`
  mutation CreateUpdateTutorOffering($tutorOfferingDto: CreateUpdateTutorOfferingDto!) {
    createUpdateTutorOffering(tutorOfferingDto: $tutorOfferingDto) {
      id
      tutor {
        id
      }
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation UpdateAvailability($tutorAvailability: TutorAvailabilityDto!) {
    updateAvailability(tutorAvailability: $tutorAvailability) {
      id
      startDate
      endDate
    }
  }
`;

export const ADD_INTERVIEW_DETAILS = gql`
  mutation AddUpdateInterviewDetails($interviewDto: CreateUpdateInterviewDto!) {
    addUpdateInterviewDetails(interviewDto: $interviewDto) {
      id
    }
  }
`;

export const ADD_TUTOR_DOCUMENT_DETAILS = gql`
  mutation AddUpdateDocumentDetail($documentDto: CreateUpdateDocumentDto!) {
    addUpdateDocumentDetail(documentDto: $documentDto) {
      id
      name
      type
      attachment {
        id
        name
        type
        filename
        size
      }
    }
  }
`;

export const DELETE_TUTOR_DOCUMENT_DETAILS = gql`
  mutation DeleteDocumentDetail($id: Int!) {
    deleteDocumentDetail(id: $id) {
      id
      name
      type
    }
  }
`;

export const ENABLE_TUTOR_OFFERING = gql`
  mutation EnableTutorOffering($tutorOfferingId: Int!) {
    enableTutorOffering(tutorOfferingId: $tutorOfferingId) {
      id
    }
  }
`;

export const DISABLE_TUTOR_OFFERING = gql`
  mutation DisableTutorOffering($tutorOfferingId: Int!) {
    disableTutorOffering(tutorOfferingId: $tutorOfferingId) {
      id
    }
  }
`;
