import { gql } from '@apollo/client';

export const MARK_FAVOURITE = gql`
  mutation MarkFavourite($tutorFavourite: CreateTutorFavouriteDto!) {
    markFavourite(tutorFavourite: $tutorFavourite) {
      id
      tutor {
        id
      }
    }
  }
`;

export const REMOVE_FAVOURITE = gql`
  mutation RemoveFromFavourite($tutorFavourite: CreateTutorFavouriteDto!) {
    removeFromFavourite(tutorFavourite: $tutorFavourite) {
      tutor {
        id
      }
    }
  }
`;
