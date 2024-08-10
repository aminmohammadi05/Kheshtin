import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const EVENT_CATEGORIES = gql`
query EventType {
  eventType {
    id
    displayText
    
  }
}
  
    `;