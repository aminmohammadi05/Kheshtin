import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BRANDS_BY_CONDITION = gql`
query GetBrandByCondition($searchText: String!) {
    searchBrands(parameters: $searchText) {
      id
      displayText
      cardImage {
        urls(first: 1)
      }
      contentItemId
    }
  }
  
    `;