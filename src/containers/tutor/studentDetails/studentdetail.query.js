import { gql } from '@apollo/client';

export const GET_TUTOR_STUDENT_SUBJECTS = gql`
  query GetTutorStudentSubjects($studentId: Int!) {
    getTutorStudentSubjects(studentId: $studentId) {
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
  }
`;
