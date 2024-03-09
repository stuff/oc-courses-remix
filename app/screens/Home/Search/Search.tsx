import algoliasearch from 'algoliasearch';
import { InstantSearch, Configure } from 'react-instantsearch';

import SearchResults from '../SearchResults';

export default function Search() {
  const searchClient = algoliasearch(
    String(window.ENV.PUBLIC_ALGOLIA_APP_ID),
    String(window.ENV.PUBLIC_ALGOLIA_API_KEY)
  );

  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: false }}
      searchClient={searchClient}
      indexName="PROD_learning-content_FR"
    >
      <Configure
        facetFilters={['search.language.value:en', 'search.type.value:course']}
        hitsPerPage={10}
      />
      <div>
        <h1>Search</h1>
        <SearchResults />
      </div>
    </InstantSearch>
  );
}
