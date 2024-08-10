import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const HOME_SERVICES = gql`
query HomeServices {
    homeService {
        displayText
        description
        image {
          urls(first: 1)
        }
        
      }
}


  
    `;