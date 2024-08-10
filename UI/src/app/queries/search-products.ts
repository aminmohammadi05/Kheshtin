import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const SEARCH_PRODUCTS = gql`
query SearchProducts {
    searchProducts(parameters: "{from: 0, size: 10, fulltext: 'ProductCategory-5'}") {
      description
      displayText
      imageList {
        contentItems {
          ... on ProductImage {
            displayText
            userTitle
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
                  displayText
                  cardImage {
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