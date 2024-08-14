import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_ALL_PRODUCTS = gql`
query GetAllProducts($first: Int!, $skip: Int!) {
    product(first: $first, skip: $skip) {
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