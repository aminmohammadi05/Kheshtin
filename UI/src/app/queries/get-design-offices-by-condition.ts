import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_DESIGN_OFFICES_BY_CONDITION = gql`
query GetDesignOfficeByCondition($searchText: String!) {
    searchDesignOffices(parameters: $searchText) {
      displayText
      logo {
        urls(first: 1)
      }
      contentItemId
    }
  }
  
    `;