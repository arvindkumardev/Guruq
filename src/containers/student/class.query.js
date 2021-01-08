import { gql } from '@apollo/client';

export const GET_AVAILABILITY_DATA = gql`
  query GetAvailabilityData($tutorAvailability: TutorAvailabilityDto!) {
    getAvailabilityData(tutorAvailability: $tutorAvailability) {
      active
      startDate
      endDate
      classScheduled
    }
  }
`;

export const GET_TUTOR_AVAILABILITY = gql`
  query GetTutorAvailability($tutorAvailability: TutorAvailabilityDto!) {
    getTutorAvailability(tutorAvailability: $tutorAvailability) {
      active
      startDate
      endDate
    }
  }
`;

export const GET_CLASS_DETAILS = gql`
  query GetClassDetails($classId: Int!) {
    getClassDetails(classId: $classId) {
      isRescheduleAllowed
      isCancelAllowed
      isClassJoinAllowed

      classEntity {
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
          user {
            id
          }
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
          user {
            id
          }
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
        documents {
          name
          attachment {
            filename
            name
            size
            type
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
      }
    }
  }
`;
