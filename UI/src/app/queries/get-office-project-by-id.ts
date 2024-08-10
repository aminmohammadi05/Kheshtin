import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GET_OFFICE_PROJECT_BY_ID = gql`
query GetProjectById($contentItemId: ID) {
    project(where: {contentItemId: $contentItemId}) {
      contentItemId
      description {
        html
      }
      extraDescription {
        html
      }
      displayText
      projectType {
        contentItems {
          ... on ProjectType {
            id
            displayText
            idNumeric
          }
        }
      }
      userTitle
      designOffice {
        contentItems {
          ... on DesignOffice {
            id
            displayText
            logo {
              urls(first: 1)
            }
            contentItemId
            email
            facebook
            instagram
            linkedIn
            phone
            twitter
            website {
              url
            }
          }
        }
      }
      address
      area
      buildingDate
      mainArchitecture
      productList {
        contentItems {
          ... on Product {
            displayText
            contentItemId
            imageList {
              contentItems {
                ... on ProductImage {
                  displayText
                  image {
                    urls(first: 1)
                  }
                }
              }
            }
            brandCollection {
              contentItems {
                ... on BrandCollection {
                  modifiedUtc
                  brand {
                    contentItems {
                      ... on Brand {
                        contentItemId
                        ovalImage {
                          urls(first: 1)
                        }
                        displayText
                      }
                    }
                  }
                }
              }
            }
            productCategory {
              contentItems {
                ... on ProductCategory {
                  id
                  displayText
                  contentItemId
                }
              }
            }
          }
        }
      }
      employer
      bag {
        contentItems {
          ... on ProjectImage {
            displayText
            image {
              urls(first: 1)
            }
          }
          ... on ProjectVideo {
            displayText
            videoLink {
              text
              url
            }
          }
        }
      }
      hashtagList {
        contentItems {
          ... on Hashtag {
            displayText
            searchField
          }
        }
      }
      brandList {
        contentItems {
          ... on Brand {
            cardImage {
              urls(first: 1)
            }
            displayText
            contentItemId
            webSiteUrl {
              url
              text
            }
          }
        }
      }
    }
  }
  
    `;