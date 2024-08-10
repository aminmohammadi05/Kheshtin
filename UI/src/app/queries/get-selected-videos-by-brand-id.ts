import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_SELECTED_VIDEOS_BY_BRAND_ID = gql`
query GetSelectedVideosByBrandId($searchText: String!) {
  getSelectedVideoByBrandId(parameters: $searchText) {
    brandVideoLink {
        text
        url
      }
      displayText
      contentItemId
      brand {
        contentItems {
          ... on Brand {
            id
            email
            cardImage {
              urls
            }
          }
        }
      }
    }
  }
    `;