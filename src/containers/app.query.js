import { gql } from '@apollo/client';

// Graph QL Query for Getting Carousels Data
export const GET_APP_CAROUSELS = gql`
query {
  getAppCarousels {
    id
    targetScreenName
    targetUser
    title
    attachment {
      id
      name
      type
      filename
      size
      original
    }
    payload {
      key
      value
    }
  }
}
`;
