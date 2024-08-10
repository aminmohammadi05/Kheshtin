import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_PRODUCT_BY_ID = gql`
query GetProductById($contentItemId: ID) {
    product(where: {contentItemId: $contentItemId}) {
      contentItemId
      displayText
      productionCode
      productCategory {
        contentItems {
          ... on ProductCategory {
            id
            displayText
          }
        }
      }
      imageList {
        contentItems {
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
                  ratingsCount
                  ratingsValue
                  webSiteUrl {
                    text
                    url
                  }
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
      productFile {
        contentItems {
          ... on ProductFile {
            contentItemId
            displayText
            fileType {
              contentItems {
                ... on FileType {
                  id
                  displayText
                }
              }
            }
            userTitle
            productFileImage {
              urls(first: 1)
            }
          }
        }
      }
      productUsage {
        contentItems {
          ... on ProductUsage {
            displayText
            productUsageValue
          }
        }
      }
    }
  }
  
    `;