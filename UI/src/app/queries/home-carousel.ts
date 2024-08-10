import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const HOME_CAROUSEL = gql`
query MyQuery {
    homeCarousel {
        displayText
        image {
          urls(first: 1)
        }
        linkToGo {
          text
          url
        }
      }
}


  
    `;