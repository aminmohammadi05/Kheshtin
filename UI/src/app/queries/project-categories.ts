import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const PROJECT_CATEGORIES = gql`
query ProjectType {
  projectType {
    id
    idNumeric
    displayText
    contentItemId
  }
}
  
    `;