import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_LATEST_OFFICE_PROJECTS_HOME = gql`
query GetLatestOfficeProjectHome($searchText: String!) {
    getLatestOfficeProjectsHome(parameters: $searchText) {
      displayText
      userTitle
      bag {
        contentItems {
          ... on ProjectImage {
            displayText
            image {
              urls(first: 1)
            }
          }
          ... on ProjectVideo {
            displayText
            videoLink {
              text
              url
            }
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