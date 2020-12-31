import { gql } from '@apollo/client';

export const GET_AWARD_LIST = gql`
  query GetTutorAwardsDetails {
    getTutorAwardsDetails {
      awards {
        id
        title
        description
        issuer
        date
      }
    }
  }
`;
