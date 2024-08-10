import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_LATEST_EVENTS = gql`
query GetLatestEvents($first: Int!, $skip: Int!) {
    event(first: $first, skip: $skip) {
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