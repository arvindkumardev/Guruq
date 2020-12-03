import { gql } from '@apollo/client';

export const GET_AVAILABILITY = gql`
  query GetAvailability($tutorAvailability: TutorAvailabilityDto!) {
    getAvailability(tutorAvailability: $tutorAvailability) {
      id
      active
      startDate
      endDate
    }
  }
`;

export const GET_CLASS_DETAILS = gql`
  query GetClassDetails($classId: Float!) {
    getClassDetails(classId: $classId) {
      uuid
      offering {
        id
        displayName
        parentOffering {
          id
          displayName
          parentOffering {
            id
            displayName
          }
        }
      }
      orderItem {
        id
      }
      students {
        id
        profileImage {
          id
          filename
        }
        contactDetail {
          firstName
          lastName
        }
      }
      tutor {
        id
        profileImage {
          id
          filename
        }
        contactDetail {
          firstName
          lastName
        }
      }
      startDate
      endDate
      status
      onlineClass
      groupClass
      demo
      presenterLink
      attendeeLink
      address {
        id
        fullAddress
      }
    }
  }
`;
