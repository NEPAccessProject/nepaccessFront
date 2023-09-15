import { QueryFunction, QueryKey, UseQueryOptions, UseQueryResult, useQuery } from 'react-query';

type Props<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>;
  children: (params: UseQueryResult<TData, TError>) => JSX.Element;
};

/**
 * Utility component for using React-Query in class components
 */
export const UseQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  props: Props<TQueryFnData, TError, TData, TQueryKey>
) => {
  const query = useQuery(props.queryKey, props.queryFn, props.options);
  return props.children(query);
};