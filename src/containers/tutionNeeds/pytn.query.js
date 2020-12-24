import { gql } from '@apollo/client';

export const GET_TUTION_NEED_LISTING = gql`
  query SearchStudentPYTN($searchDto: StudentPYTNSearchDto!) {
    searchStudentPYTN(searchDto: $searchDto) {
      edges {
        id
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
        count
        groupSize
        onlineClass
        minPrice
        maxPrice
        student {
          id
          contactDetail {
            firstName
            lastName
            gender
          }
          profileImage {
            filename
          }
        }
      }
    }
  }
`;

export const GET_ACCEPTED_TUTOR_NEED = gql`
  query GetStudentPytnAccepted($studentPytnId: Int!) {
    getStudentPytnAccepted(studentPytnId: $studentPytnId) {
      edges {
        studentPytnEntity {
          id
        }
        tutor {
          contactDetail {
            firstName
            lastName
          }
          profileImage {
            filename
          }
        }
        id
        price
      }
    }
  }
`;
