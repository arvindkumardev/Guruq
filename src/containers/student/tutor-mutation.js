import { gql } from '@apollo/client';

export const MARK_FAVOURITE = gql`
  mutation MarkFavourite($tutorId: Int!) {
    markFavourite(tutorId: $tutorId) {
      id
      tutor {
        id
      }
    }
  }
`;

export const REMOVE_FAVOURITE = gql`
  mutation RemoveFromFavourite($tutorId: Int!) {
    removeFromFavourite(tutorId: $tutorId) {
      tutor {
        id
      }
    }
  }
`;
