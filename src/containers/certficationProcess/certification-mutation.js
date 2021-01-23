import { gql } from '@apollo/client';

export const MARK_CERTIFIED = gql`
  mutation CertificationStageComplete($currentStage: TutorCertificationStageEnum!) {
    certificationStageComplete(currentStage: $currentStage) {
      id
    }
  }
`;

export const UPDATE_BACKGROUND_CHECK = gql`
  mutation UpdateBackgroundCheck {
    updateBackgroundCheck {
      id
    }
  }
`;
