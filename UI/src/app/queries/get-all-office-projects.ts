import gql from 'graphql-tag';
export const GET_ALL_OFFICE_PROJECTS = gql`
query GetAllOfficeProjects($first: Int!, $skip: Int!) {
    project(first: $first, skip: $skip) {
      displayText
      userTitle
      bag {
        contentItems {
          ... on ProjectImage {
            displayText
            image {
              urls(first: 1)
            }
          }
          ... on ProjectVideo {
            displayText
            videoLink {
              text
              url
            }
          }
        }
      }
      contentItemId
      designOffice {
        contentItems {
          ... on DesignOffice {
            id
            displayText
            logo {
              urls(first: 1)
            }
          }
        }
      }
      projectType {
        contentItems {
          ... on ProjectType {
            id
            displayText
          }
        }
      }
    }
  }
  
    `;