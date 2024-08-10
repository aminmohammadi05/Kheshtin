import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const MENU_LIST = gql`
query MyQuery {
  menu {
    alias {
      alias
    }
    displayText
    menuItemsList {
      menuItems {
        ... on LinkMenuItem {
          id
          megaMenu
          displayText
          bag {
            contentItems {
              ... on LinkMenuItem {
                id
                displayText
                megaMenu
                brandList {
                  contentItems {
                    ... on Brand {
                      displayText
                      alias {
                        alias
                      }
                      ovalImage {
                        urls(first: 1)
                      }
                    }
                  }
                }
                ovalImage {
                  urls(first: 1)
                }
                bag {
                  contentItems {
                    ... on LinkMenuItem {
                      id
                      displayText
                      megaMenu
                      linkMenuItem {
                        name
                        url
                      }
                      urlParameterList
                    }
                  }
                }
                lightBackground
                darkBackground
              }
            }
          }
          linkMenuItem {
            name
            url
          }
          isDisabled
          toolTipText
        }
      }
    }
  }
}



  
    `;