import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_PRODUCTS_BY_CONDITION = gql`
query GetProductsByCondition($searchText: String!) {
    searchProducts(parameters: $searchText) {
      contentItemId
      displayText
      productCategory {
        contentItems {
          ... on ProductCategory {
            id
            displayText
          }
        }
      }
      imageList {
        contentItems(first: 4) {
          ... on ProductImage {
            displayText
            image {
              urls(first: 1)
            }
          }
        }
      }
      brandCollection {
        contentItems {
          ... on BrandCollection {
            brand {
              contentItems {
                ... on Brand {
                  contentItemId
                  displayText
                  ovalImage {
                    urls(first: 1)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
    `;