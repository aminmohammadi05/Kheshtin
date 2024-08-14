import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_SELECTED_PROJECTS_BY_BRAND_ID = gql`
query GetSelectedProjectsByBrandId($searchText: String!) {
  getSelectedProjectsByBrandIdEls(parameters: $searchText) {
    displayText
      userTitle
      bag {
        contentItems {
          ... on ProjectImage {
            displayText
            image {
              urls
            }
            userTitle
          }
        }
      }
      contentItemId
      designOffice {
        contentItems {
          ... on DesignOffice {
            id
            displayText
            logo {
              urls(first: 1)
            }
          }
        }
      }
      projectType {
        contentItems {
          ... on ProjectType {
            id
            displayText
          }
        }
      }
    }
  }
    `;