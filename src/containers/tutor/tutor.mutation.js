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
