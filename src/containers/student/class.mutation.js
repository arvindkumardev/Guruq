import { gql } from '@apollo/client';

export const SCHEDULE_CLASS = gql`
  mutation ScheduleClass($classesCreateDto: CreateUpdateClassesDto!) {
    scheduleClass(classesCreateDto: $classesCreateDto) {
      id
      uuid
      orderItem {
        id
      }
      students {
        id
      }
      tutor {
        id
      }
      offering {
        id
      }
      onlineClass
      demo

      startDate
      endDate
    }
  }
`;

export const CANCEL_CLASS = gql`
  mutation CancelClass($classId: Int!, $cancelReason: ClassCancelReasonEnum!, $comments: String!) {
    cancelClass(classId: $classId, cancelReason: $cancelReason, comments: $comments) {
      id
      status
    }
  }
`;
