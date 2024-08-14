import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_PROJECTS_BY_CONDITION = gql`
query GetProjectByCondition($searchText: String!) {
    searchProjects(parameters: $searchText) {
      displayText
      userTitle
      imageList {
        contentItems(first: 4) {
          ... on ProjectImage {
            displayText
            contentItemId
            image {
              urls(first: 1)
            }
            userTitle
          }
        }
      }
      contentItemId
      projectType {
        contentItems {
          ... on ProjectType {
            id
            displayText
          }
        }
      }
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
    }
  }
  
    `;