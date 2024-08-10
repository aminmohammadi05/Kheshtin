import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const SEARCH_BRANDS = gql`
query MyQuery {
    brand {
      displayText
      contentItemId
      
    }
  }
    `;