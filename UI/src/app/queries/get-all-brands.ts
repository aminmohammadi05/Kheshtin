import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_ALL_BRANDS = gql`
query GetAllBrands($first: Int!, $skip: Int!) {
    brand(first: $first, skip: $skip) {
      id
      displayText
      cardImage {
        urls(first: 1)
      }
      contentItemId
    }
  }
  
    `;