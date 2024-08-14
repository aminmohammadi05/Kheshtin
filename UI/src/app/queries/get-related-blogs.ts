import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_RELATED_BLOGS = gql`
query GetRelatedBlogs($searchText: String!) {
  getRelatedBlogs(parameters: $searchText) {
      displayText
      bag {
        contentItems(first: 4) {
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
      contentItemId
    }
  }
  
    `;