import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BRANDS_SELECTED_FOR_HOME = gql`
query GetBrandSelectedForHome($searchText: String!) {
    getBrandsSelectedForHome(parameters: $searchText) {
      id
      displayText
      cardImage {
        urls(first: 1)
      }
      contentItemId
    }
  }
  
    `;