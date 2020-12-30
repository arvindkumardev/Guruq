import { gql } from '@apollo/client';

export const DELETE_BANK_DETAIL = gql`
  mutation DeleteExperienceDetail($id: Int!) {
    deleteExperienceDetail(id: $id) {
      id
    }
  }
`;

export const ADD_UPDATE_BANK_DETAILS = gql`
  mutation UpdateBankDetails($bankDetailsDto: CreateUpdateBankDetailsDto!) {
    updateBankDetails(bankDetailsDto: $bankDetailsDto) {
      id
      accountHolder
      bankName
      branchAddress
      accountNumber
      ifscCode
    }
  }
`;
