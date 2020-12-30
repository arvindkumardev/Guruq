import { gql } from '@apollo/client';

export const SEARCH_TUTOR_OFFERINGS = gql`
  query SearchTutorOfferings($tutorId: Int!) {
    searchTutorOfferings(tutorId: $tutorId) {
      id
      demoClass
      freeDemo
      onlineClass
      groupClass
      tutor {
        id
      }
      stage
      description
      active
      offering {
        id
        displayName
        parentOffering {
          id
          level
          displayName
          parentOffering {
            id
            level
            displayName
          }
        }
        rootOffering {
          id
          displayName
        }
      }
      offerings {
        id
        level
        displayName
        parentOffering {
          id
          level
          displayName
          parentOffering {
            id
            level
            displayName
          }
        }
        rootOffering {
          id
          displayName
        }
      }
      budgets {
        id
        price
        groupSize
        count
        onlineClass
        demo
      }
    }
  }
`;
