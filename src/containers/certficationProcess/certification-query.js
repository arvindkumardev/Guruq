import { gql } from '@apollo/client';

export const GET_TUTOR_LEAD_DETAIL = gql`
  query GetTutorLeadDetails {
    getTutorLeadDetails {
      id
      tutorOffering {
        id
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
      }

      tutorProficiencyTest {
        id
        status
        score
        notAttempted
        maxMarks
      }
      certificationStage
    }
  }
`;

export const GET_TUTOR_OFFERING_DETAIL = gql`
  query GetTutorOfferingDetails($tutorOfferingId: Int!) {
    getTutorOfferingDetails(tutorOfferingId: $tutorOfferingId) {
      id
      offerings {
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

      tutorProficiencyTests {
        id
        status
        score
        notAttempted
        maxMarks
      }
    }
  }
`;
