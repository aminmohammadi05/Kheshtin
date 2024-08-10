import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_VIDEOS_BY_OFFICE_ID = gql`
query GetVideosByOfficeId($searchText: String!) {
  getVideoByOfficeId(parameters: $searchText) {
    designOfficeVideoLink {
        text
        url
      }
      displayText
      contentItemId
      designOffice {
        contentItems {
          ... on DesignOffice {
            id
            email
            logo {
              urls
            }
          }
        }
      }
    }
  }
    `;