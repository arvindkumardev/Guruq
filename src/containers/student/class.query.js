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
  query GetClassDetails($classId: Int!) {
    getClassDetails(classId: $classId) {
      id
      createdDate
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
          gender
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
          gender
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
        city
        state
        country
        fullAddress
        latitude
        longitude
      }
    }
  }
`;
