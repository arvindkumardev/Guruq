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
          #parentOffering {
          #  id
          #  name
          #  displayName
          #  slug
          #  level
          #}
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
