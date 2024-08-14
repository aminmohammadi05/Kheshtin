import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_PROJECTS_BY_BRAND_ID = gql`
query GetProjectsByBrandId($searchText: String!) {
  getProjectByBrandId(parameters: $searchText) {
    displayText
      userTitle
      imageList {
        contentItems(first: 4) {
          ... on ProjectImage {
            displayText
            image {
              urls(first: 1)
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