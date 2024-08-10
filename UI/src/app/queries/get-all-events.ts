import gql from 'graphql-tag';
export const GET_ALL_EVENTS = gql`
query GetAllEvents($first: Int!, $skip: Int!) {
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