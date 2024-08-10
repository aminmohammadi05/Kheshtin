import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_BRAND_BY_ID = gql`
query GetBrandById($contentItemId: ID) {
    brand(where: {contentItemId: $contentItemId}) {
      id
      displayText
      cardImage {
        urls(first: 1)
      }
      ovalImage {
        urls(first: 1)
      }
      contentItemId
      ratingsCount
      ratingsValue
      webSiteUrl {
        url
        text
      }
      brandDescription {
        html
      }
      email
      facebook
      history
      linkedIn
      instagram
      phoneNumber
      twitter
    }
  }
  
    `;