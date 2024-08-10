import gql from 'graphql-tag';
export const GET_ALL_DESIGN_OFFICES_FOR_DROPDOWN = gql`
query EventType {
    designOffice {
      displayText
      id
      contentItemId
    }
  }`
  ;