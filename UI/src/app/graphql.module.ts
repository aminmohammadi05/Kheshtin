import {} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloModule, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';
const uri = 'https://orchard.kheshtin.ir/api/graphql';
export function createApollo(httpLink: HttpLink) {
	return {
	  link: httpLink.create({ uri }),
	  cache: new InMemoryCache(),
	  defaultOptions: {
		watchQuery: {
		  fetchPolicy: 'no-cache',
		  errorPolicy: 'ignore',
		},
		query: {
		  fetchPolicy: 'no-cache',
		  errorPolicy: 'all',
		},
	  }
	};
  }
  
  @NgModule({
	exports: [ApolloModule, HttpClientModule],
	providers: [
	  {
		provide: APOLLO_OPTIONS,
		useFactory: createApollo,
		deps: [HttpLink],
	  },
	],
  })
  export class GraphQLModule { }