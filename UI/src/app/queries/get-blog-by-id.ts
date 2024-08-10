import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BLOG_BY_ID = gql`
query GetBlogById($contentItemId: ID) {
    blog(where: {contentItemId: $contentItemId}) {
      blogText {
        html
      }
      contentItemId
      createdUtc
      secondHeaderTitle
      displayText
      hashtagList {
        contentItems {
          ... on Hashtag {
            displayText
            searchField
          }
        }
      }
      productCategory {
        contentItems {
          ... on ProductCategory {
            id
            displayText
            categoryId
            userTitle
          }
        }
      }
      author
      bag {
        contentItems {
          ... on BlogVideo {
            displayText
            videoLink {
              text
              url
            }
          }
          ... on BlogImage {
            displayText
            isHeaderImage
            userTitle
            priority
            image {
              urls(first: 1)
            }
          }
        }
      }
    }
  }
  
    `;