import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_EVENTS_BY_CONDITION = gql`
query GetEventsByCondition($searchText: String!) {
    searchEvents(parameters: $searchText) {
      displayText
      contentItemId
      eventType {
        contentItems {
          ... on EventType {
            id
            displayText
          }
        }
      }
      bag {
        contentItems {
          ... on EventStep {
            stepDate
            stepEndDate
            userTitle
            eventIcon {
              contentItems {
                ... on EventStepIcon {
                  displayText
                  iconTitle
                }
              }
            }
          }
          ... on EventImage {
            displayText
            modifiedUtc
            image {
              urls(first: 1)
            }
          }
        }
      }
    }
  }
  
    `;