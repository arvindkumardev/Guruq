import { gql } from '@apollo/client';

export const MARK_FAVOURITE = gql`
  mutation MarkFavourite($tutorFavourite: CreateUpdateTutorFavouriteDto!) {
    markFavourite(tutorFavourite: $tutorFavourite) {
      id
      tutor {
        id
      }
    }
  }
`;

export const REMOVE_FAVOURITE = gql`
  mutation RemoveFromFavourite($tutorFavourite: CreateUpdateTutorFavouriteDto!) {
    removeFromFavourite(tutorFavourite: $tutorFavourite) {
      tutor {
        id
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($review: CreateUpdateReviewDto!) {
    addReview(review: $review) {
      id
    }
  }
`;
