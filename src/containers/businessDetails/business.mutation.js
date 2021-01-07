import { gql } from '@apollo/client';

export const ADD_UPDATE_BUSINESS_DETAILS = gql`
  mutation UpdateBusinessDetails($businessDetailsDto: CreateUpdateBusinessDetailsDto!) {
    updateBusinessDetails(businessDetailsDto: $businessDetailsDto) {
      id
    }
  }
`;
