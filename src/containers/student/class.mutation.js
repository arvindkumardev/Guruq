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
  mutation CancelClass($classesId: Float!) {
    cancelClass(classesId: $classesId) {
      id
      status
    }
  }
`;
