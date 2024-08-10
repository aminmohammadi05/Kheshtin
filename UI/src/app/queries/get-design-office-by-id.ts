import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_DESIGN_OFFICE_BY_ID = gql`
query GetDesignOfficeById($contentItemId: ID) {
    designOffice(where: {contentItemId: $contentItemId}) {
        description {
            html
          }
          displayText
          contentItemId
          hashtagList {
            contentItems {
              ... on Hashtag {
                displayText
                searchField
              }
            }
          }
          email
          facebook
          id
          instagram
          linkedIn
          logo {
            urls(first: 0)
          }
          website {
            text
            url
          }
          twitter
          phone
          ratingsCount
          ratingsValue
    }
  }
  
    `;