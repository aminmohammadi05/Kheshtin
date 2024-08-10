import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_SELECTED_BRAND_COLLECTIONS_BY_BRAND_ID = gql`
query GetSelectedBrandCollectionByBrandId($searchText: String!) {
    getSelectedBrandCollectionByBrandId(parameters: $searchText) {
      displayText
      userTitle
      contentItemId
      collectionImage {
        urls(first: 1)
      }
    }
  }
    `;