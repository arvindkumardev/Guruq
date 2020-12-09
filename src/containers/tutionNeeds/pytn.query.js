import { gql } from '@apollo/client';

export const GET_TUTION_NEED_LISTING = gql`
  query SearchStudentPYTN($searchDto: StudentPYTNSearchDto!) {
    searchStudentPYTN(searchDto: $searchDto) {
      edges {
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
