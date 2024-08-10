import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const BRANDS_SEARCH = gql`
query MyQuery {
    brand {
      displayText
      contentItemId
      
    }
  }
    `;