import gql from 'graphql-tag';
export const GET_ALL_DESIGN_OFFICES = gql`
query GetAllDesignOffices($first: Int!, $skip: Int!) {
  designOffice(first: $first, skip: $skip) {
      displayText
      logo {
        urls(first: 1)
      }
      contentItemId
    }
  }
  
    `;