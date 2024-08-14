import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_LATEST_BLOGS_HOME = gql`
query GetLatestBlogs($searchText: String!) {
    getLatestBlogsHome(parameters: $searchText) {
      displayText
      secondHeaderTitle
      createdUtc
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