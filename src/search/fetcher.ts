import React, {useQuery, useQueryClient} from 'react-query';

enum HTTPVerbs {
  GET,
  POST
}

interface IQueryOptions {
  page_size?: number;
  page?: number;
  sort?: string;
  sort_dir?: string;
}
//Minimal interface to take key / value pairs and conver it to a HTML Query String
interface IQueryFilters {
  [key: string]: any;
}

interface IQueryParams {
  name: string;
  apiRoot: string;
  options?: IQueryOptions;
  filters? :IQueryFilters;
}

//class that implements IQueryParams for passing query params to the API
class QueryParams implements IQueryParams {
  constructor(public name: string, public apiRoot: string, public options?: IQueryOptions, public filters?: IQueryFilters) {
    this.name = name;
    this.apiRoot= apiRoot;
    this.apiRoot = apiRoot;
    this.options = options;
    this.filters = filters;
  }

}

const queryFiltersToQueryString = (filters) => {
  let queryString = ``;
  Object.keys(filters).forEach((key:string) => {
    queryString += `${key}=${filters[key]}&`;
  })
  console.log('create querystring from filters:',queryString)
  return queryString.slice(0,-1);
}
const fetch = (params:IQueryParams) => {
  const qs = queryFiltersToQueryString(params);
  const url = `${params.apiRoot}?${qs}`;
  return _get(url);

}

const _get = ((url) => {
    const queryClient = useQueryClient();
    return useQuery(['search', url], () => fetch(url), {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: url !== '',
        onSuccess: () => queryClient.invalidateQueries(['search', url]),
    });
});

// TODO: Add test cases