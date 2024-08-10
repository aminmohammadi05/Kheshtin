import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const SELECTED_BRANDS = gql`
query MyQuery {
    brand {
      displayText
      id
      brandCollectionList {
        contentItems {
          ... on BrandCollection {
            displayText
            userTitle
            id
          }
        }
      }
    }
  }
    `;