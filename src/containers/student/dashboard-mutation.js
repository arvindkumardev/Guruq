import { gql } from '@apollo/client';

export const ADD_INTERESTED_OFFERINGS = gql`
  mutation AddInterestedOffering($offeringId: Int!) {
    addInterestedOffering(offeringId: $offeringId) {
      selected
      offering {
        id
        name
        displayName
        slug
        level
        parentOffering {
          id
          name
          displayName
          slug
          level
        }
      }
    }
  }
`;

export const REMOVE_INTERESTED_OFFERINGS = gql`
  mutation RemoveInterestedOffering($offeringId: Int!) {
    removeInterestedOffering(offeringId: $offeringId) {
      selected
      offering {
        id
        name
        displayName
        slug
        level
        parentOffering {
          id
          name
          displayName
          slug
          level
        }
      }
    }
  }
`;

export const MARK_INTERESTED_OFFERING_SELECTED = gql`
  mutation MarkInterestedOfferingSelected($offeringId: Int!) {
    markInterestedOfferingSelected(offeringId: $offeringId) {
      selected
      offering {
        id
        name
        displayName
        slug
        level
        parentOffering {
          id
          name
          displayName
          slug
          level
        }
      }
    }
  }
`;
