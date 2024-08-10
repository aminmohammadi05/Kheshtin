import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_EVENT_BY_ID = gql`
query GetEventById($contentItemId: ID) {
    event(where: {contentItemId: $contentItemId}) {
      contentItemId
      displayText
      bag {
        contentItems {
          ... on EventStep {
            stepDate
            stepEndDate
            userTitle
            description {
              html
            }
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
      eventType {
        contentItems {
          ... on EventType {
            displayText
            categoryId
          }
        }
      }
      description {
        html
      }
      hashtagList {
        contentItems {
          ... on Hashtag {
            displayText
            searchField
          }
        }
      }
    }
  }
  
    `;