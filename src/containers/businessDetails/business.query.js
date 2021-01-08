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
          }
        }
        gstCertificate {
          id
          name
          attachment {
            name
            filename
            type
          }
        }
        createdDate
      }
    }
  }
`;

export const GET_TUTOR_DOCUMENT_DETAILS = gql`
  query getTutorDocumentDetails {
    getTutorDocumentDetails {
      documents {
        id
        name
        createdDate
        attachment {
          filename
          name
          size
          type
        }
      }
    }
  }
`;
