import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_SELECTED_CATALOGS_BY_BRAND_ID = gql`
query GetSelectedCatalogsByBrandId($searchText: String!) {
    getSelectedBrandCatalogByBrandId(parameters: $searchText) {
        displayText
    brandCatalogImage {
        urls
      }
      brandCatalogLink {
        url
        text
      }
      contentItemId
    }
  }
    `;