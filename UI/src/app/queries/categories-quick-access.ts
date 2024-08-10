import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const CATEGORIES_QUICK_ACCESS = gql`
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
            userTitle
            image {
                urls(first: 1)
              }
          }
        }
      }
      userTitle
    }
  }
    `;