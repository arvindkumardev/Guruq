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
  query GetClassDetails($classId: Int!, $uuid: String!) {
    getClassDetails(classId: $classId, uuid: $uuid) {
      isRescheduleAllowed
      isCancelAllowed
      isClassJoinAllowed
      isMessagingAllowed
      isUploadAttachmentAllowed

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
            original
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
            original
          }
          contactDetail {
            firstName
            lastName
            gender
          }
        }
        documents {
          name
          id
          attachment {
            filename
            name
            size
            type
            original
          }
          createdDate
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

export const GET_CLASS_DETAILS_BY_UUID = gql`
  query GetClassDetailsByUuid($uuid: String!) {
    classDetails: getClassDetailsByUuid(uuid: $uuid) {
      isRescheduleAllowed
      isCancelAllowed
      isClassJoinAllowed
      isClassEnded
      isMessagingAllowed
      isUploadAttachmentAllowed

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
            original
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
            original
          }
          contactDetail {
            firstName
            lastName
            gender
          }
        }
        documents {
          name
          id
          attachment {
            filename
            name
            size
            type
            original
          }
          createdDate
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
