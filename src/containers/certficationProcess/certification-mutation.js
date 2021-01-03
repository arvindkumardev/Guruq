import { gql } from '@apollo/client';

export const MARK_CERTIFIED = gql`
  mutation certificationStageComplete {
    certificationStageComplete {
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
