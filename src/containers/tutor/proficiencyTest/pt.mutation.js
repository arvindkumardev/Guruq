import { gql } from '@apollo/client';

export const START_PROFICIENCY_TEST = gql`
  mutation($tutorOfferingId: Int!) {
    startProficiencyTest(tutorOfferingId: $tutorOfferingId) {
      tutorOffering {
        offering {
          id
          displayName
        }
        offerings {
          id
          displayName
        }
        stage
        allowedPTAttempts
        tutorProficiencyTests {
          id
          status
          maxMarks
          score
          notAttempted
          timeTaken
          testDate
        }
      }
      tutorPT {
        id
        timeTaken
        testDate
        status
        score
      }
      questions {
        id
        question
        questionType
        difficulty
        answers {
          id
          text
          # answer
        }
      }
    }
  }
`;

export const CHECK_PT_RESPONSE = gql`
  mutation CheckPTResponse($checkPTDto: CheckPTDto!) {
    checkPTResponse(checkPTDto: $checkPTDto) {
      id
      tutorOffering {
        id
      }
      status
      score
      notAttempted
      maxMarks
      timeTaken
      testDate
      submission
    }
  }
`;
