import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BRAND_COLLECTIONS_BY_BRAND_ID = gql`
query GetBrandCollectionByBrandId($searchText: String!) {
    getBrandCollectionByBrandId(parameters: $searchText) {
      displayText
      userTitle
      contentItemId
      collectionImage {
        urls(first: 1)
      }
    }
  }
    `;