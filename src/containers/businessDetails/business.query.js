import { gql } from '@apollo/client';

export const GET_BUSINESS_DETAILS_DATA = gql`
  query GetTutorBusinessDetails {
    getTutorBusinessDetails {
      businessDetails {
        id
        businessName
        gstNumber
        gstEligible
        panNumber
        panCard {
          id
          name
          attachment {
            name
            filename
            type
            size
            original
          }
        }
        gstCertificate {
          id
          name
          attachment {
            name
            filename
            type
            size
            original
          }
        }
        createdDate
      }
    }
  }
`;
