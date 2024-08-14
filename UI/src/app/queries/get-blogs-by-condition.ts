import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BLOGS_BY_CONDITION = gql`
query GetBlogByCondition($searchText: String!) {
    searchBlogs(parameters: $searchText) {
      displayText
      createdUtc
      secondHeaderTitle
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
