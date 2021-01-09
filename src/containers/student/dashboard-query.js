import { gql } from '@apollo/client';

export const GET_OFFERINGS_MASTER_DATA = gql`
  query GetOfferingsMasterData {
    offerings {
      edges {
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
          parentOffering {
            id
            name
            displayName
            slug
            level
          }
        }
        rootOffering {
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

export const GET_INTERESTED_OFFERINGS = gql`
  query GetInterestedOfferings {
    getInterestedOfferings {
      id
      active
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
        rootOffering {
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

export const GET_SPONSORED_TUTORS = gql`
  query GetSponsoredTutors($parentOfferingId: Int!) {
    getSponsoredTutors(parentOfferingId: $parentOfferingId) {
      tutor {
        id
        contactDetail {
          firstName
          lastName
          gender
        }
        profileImage {
          filename
          original
        }
        tutorOfferings {
          id
          offerings {
            id
            level
            displayName
          }
        }
        averageRating
        teachingExperience
      }
    }
  }
`;
