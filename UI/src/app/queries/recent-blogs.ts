import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const RECENT_BLOGS = gql`
query SearchProducts {
    product(parameters: "{from: 0, size: 10}") {
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