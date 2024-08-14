import gql from 'graphql-tag';
export const GET_ALL_PROJECTS = gql`
query GetAllProjects($first: Int!, $skip: Int!) {
    project(first: $first, skip: $skip) {
      displayText
      imageList {
        contentItems(first: 4) {
          ... on ProjectImage {
            displayText
            image {
              urls(first: 1)
            }
            userTitle
          }
        }
      }
      contentItemId
    }
  }
  
    `;