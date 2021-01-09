import { gql } from '@apollo/client';

export const GET_BANK_DETAILS_DATA = gql`
  query GetTutorBankDetails {
    getTutorBankDetails {
      bankDetails {
        id
        accountHolder
        bankName
        branchAddress
        accountNumber
        ifscCode
        primary
      }
    }
  }
`;
