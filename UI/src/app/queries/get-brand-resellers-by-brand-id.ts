import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BRAND_RESELLERS_BY_BRAND_ID = gql`
query GetBrandResellerByBrandId($searchText: String!) {
    getResellerByBrandId(parameters: $searchText) {
      contentItemId
      city
      address
      displayText
      phone
    }
  }
    `;