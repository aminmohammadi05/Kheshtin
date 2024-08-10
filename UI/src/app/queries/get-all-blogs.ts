import gql from 'graphql-tag';
export const GET_ALL_BLOGS = gql`
query GetAllBlogs($first: Int!, $skip: Int!) {
    blog(first: $first, skip: $skip) {
      displayText
      secondHeaderTitle
      createdUtc
      contentItemId
      bag {
        contentItems {
          ... on BlogImage {
            displayText
            userTitle
            isHeaderImage
            priority
            image {
              urls(first: 1)
            }
          }
        }
      }
    }
  }
    `
    ;
