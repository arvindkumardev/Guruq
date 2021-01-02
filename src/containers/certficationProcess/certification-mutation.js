import { gql } from '@apollo/client';

export const MARK_CERTIFIED = gql`
  mutation certificationStageComplete {
    certificationStageComplete {
      id
    }
  }
`;
