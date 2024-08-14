import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_DESIGNOFFICE_PROJECTS = gql`
query GetDesignOfficeProjectByCondition($searchText: String!) {
    getDesignOfficeProjects(parameters: $searchText) {
      displayText
      userTitle
      bag {
        contentItems(first: 4) {
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
      hashtagList {
        contentItems {
          ... on Hashtag {
            displayText
            searchField
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