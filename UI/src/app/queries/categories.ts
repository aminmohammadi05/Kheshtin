import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const CATEGORIES = gql`
query MyQuery {
  productCategory(where: {alias: {alias_starts_with: "building"}}) {
    categoryId
    id
    displayText
    childrenCategories {
      contentItems {
        ... on ProductCategory {
          id
          categoryId
          displayText
          childrenCategories {
            contentItems {
              ... on ProductCategory {
                id
                displayText
                categoryId
                userTitle
                parentCategory {
                  contentItems {
                    ... on ProductCategory {
                      id
                      categoryId
                    }
                  }
                }
              }
            }
          }
          userTitle
          parentCategory {
            contentItems {
              ... on ProductCategory {
                id
                categoryId
              }
            }
          }
        }
      }
    }
    userTitle
  }
}
  
    `;