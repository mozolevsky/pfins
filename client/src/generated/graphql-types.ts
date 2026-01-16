import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Asset = {
  __typename?: 'Asset';
  id?: Maybe<Scalars['String']['output']>;
  priceHistory?: Maybe<Array<Maybe<PriceHistory>>>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};


export type AssetPriceHistoryArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type AssetInput = {
  type: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type AssetUpdateInput = {
  id: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAsset?: Maybe<Asset>;
  addPriceRecord?: Maybe<PriceHistory>;
  deleteAsset?: Maybe<Scalars['String']['output']>;
  updateAsset?: Maybe<Asset>;
};


export type MutationAddAssetArgs = {
  asset?: InputMaybe<AssetInput>;
};


export type MutationAddPriceRecordArgs = {
  assetId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  timestamp?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateAssetArgs = {
  asset?: InputMaybe<AssetUpdateInput>;
};

export type PriceHistory = {
  __typename?: 'PriceHistory';
  assetId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  asset?: Maybe<Asset>;
  assetByType?: Maybe<Array<Maybe<Asset>>>;
  assets?: Maybe<Array<Maybe<Asset>>>;
  priceHistory?: Maybe<Array<Maybe<PriceHistory>>>;
};


export type QueryAssetArgs = {
  id: Scalars['String']['input'];
};


export type QueryAssetByTypeArgs = {
  type: Scalars['String']['input'];
};


export type QueryPriceHistoryArgs = {
  assetId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type AddAssetMutationVariables = Exact<{
  asset?: InputMaybe<AssetInput>;
}>;


export type AddAssetMutation = { __typename?: 'Mutation', addAsset?: { __typename?: 'Asset', type?: string | null, value?: number | null } | null };

export type UpdateAssetMutationVariables = Exact<{
  asset?: InputMaybe<AssetUpdateInput>;
}>;


export type UpdateAssetMutation = { __typename?: 'Mutation', updateAsset?: { __typename?: 'Asset', type?: string | null, value?: number | null } | null };

export type DeleteAssetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAssetMutation = { __typename?: 'Mutation', deleteAsset?: string | null };

export type AddPriceRecordMutationVariables = Exact<{
  assetId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  timestamp?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddPriceRecordMutation = { __typename?: 'Mutation', addPriceRecord?: { __typename?: 'PriceHistory', id: number, assetId: string, price: number, timestamp: string } | null };

export type GetAssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAssetsQuery = { __typename?: 'Query', assets?: Array<{ __typename?: 'Asset', id?: string | null, type?: string | null, value?: number | null } | null> | null };

export type GetAssetsByTypeQueryVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type GetAssetsByTypeQuery = { __typename?: 'Query', assetByType?: Array<{ __typename?: 'Asset', id?: string | null, type?: string | null, value?: number | null } | null> | null };

export type GetAssetWithHistoryQueryVariables = Exact<{
  type: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAssetWithHistoryQuery = { __typename?: 'Query', assetByType?: Array<{ __typename?: 'Asset', id?: string | null, type?: string | null, value?: number | null, priceHistory?: Array<{ __typename?: 'PriceHistory', id: number, price: number, timestamp: string } | null> | null } | null> | null };

export type GetPriceHistoryQueryVariables = Exact<{
  assetId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPriceHistoryQuery = { __typename?: 'Query', priceHistory?: Array<{ __typename?: 'PriceHistory', id: number, assetId: string, price: number, timestamp: string } | null> | null };


export const AddAssetDocument = gql`
    mutation AddAsset($asset: AssetInput) {
  addAsset(asset: $asset) {
    type
    value
  }
}
    `;
export type AddAssetMutationFn = Apollo.MutationFunction<AddAssetMutation, AddAssetMutationVariables>;

/**
 * __useAddAssetMutation__
 *
 * To run a mutation, you first call `useAddAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAssetMutation, { data, loading, error }] = useAddAssetMutation({
 *   variables: {
 *      asset: // value for 'asset'
 *   },
 * });
 */
export function useAddAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddAssetMutation, AddAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddAssetMutation, AddAssetMutationVariables>(AddAssetDocument, options);
      }
export type AddAssetMutationHookResult = ReturnType<typeof useAddAssetMutation>;
export type AddAssetMutationResult = Apollo.MutationResult<AddAssetMutation>;
export type AddAssetMutationOptions = Apollo.BaseMutationOptions<AddAssetMutation, AddAssetMutationVariables>;
export const UpdateAssetDocument = gql`
    mutation UpdateAsset($asset: AssetUpdateInput) {
  updateAsset(asset: $asset) {
    type
    value
  }
}
    `;
export type UpdateAssetMutationFn = Apollo.MutationFunction<UpdateAssetMutation, UpdateAssetMutationVariables>;

/**
 * __useUpdateAssetMutation__
 *
 * To run a mutation, you first call `useUpdateAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAssetMutation, { data, loading, error }] = useUpdateAssetMutation({
 *   variables: {
 *      asset: // value for 'asset'
 *   },
 * });
 */
export function useUpdateAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAssetMutation, UpdateAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAssetMutation, UpdateAssetMutationVariables>(UpdateAssetDocument, options);
      }
export type UpdateAssetMutationHookResult = ReturnType<typeof useUpdateAssetMutation>;
export type UpdateAssetMutationResult = Apollo.MutationResult<UpdateAssetMutation>;
export type UpdateAssetMutationOptions = Apollo.BaseMutationOptions<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetDocument = gql`
    mutation DeleteAsset($id: String!) {
  deleteAsset(id: $id)
}
    `;
export type DeleteAssetMutationFn = Apollo.MutationFunction<DeleteAssetMutation, DeleteAssetMutationVariables>;

/**
 * __useDeleteAssetMutation__
 *
 * To run a mutation, you first call `useDeleteAssetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAssetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAssetMutation, { data, loading, error }] = useDeleteAssetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAssetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAssetMutation, DeleteAssetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAssetMutation, DeleteAssetMutationVariables>(DeleteAssetDocument, options);
      }
export type DeleteAssetMutationHookResult = ReturnType<typeof useDeleteAssetMutation>;
export type DeleteAssetMutationResult = Apollo.MutationResult<DeleteAssetMutation>;
export type DeleteAssetMutationOptions = Apollo.BaseMutationOptions<DeleteAssetMutation, DeleteAssetMutationVariables>;
export const AddPriceRecordDocument = gql`
    mutation AddPriceRecord($assetId: String!, $price: Float!, $timestamp: String) {
  addPriceRecord(assetId: $assetId, price: $price, timestamp: $timestamp) {
    id
    assetId
    price
    timestamp
  }
}
    `;
export type AddPriceRecordMutationFn = Apollo.MutationFunction<AddPriceRecordMutation, AddPriceRecordMutationVariables>;

/**
 * __useAddPriceRecordMutation__
 *
 * To run a mutation, you first call `useAddPriceRecordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPriceRecordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPriceRecordMutation, { data, loading, error }] = useAddPriceRecordMutation({
 *   variables: {
 *      assetId: // value for 'assetId'
 *      price: // value for 'price'
 *      timestamp: // value for 'timestamp'
 *   },
 * });
 */
export function useAddPriceRecordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddPriceRecordMutation, AddPriceRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddPriceRecordMutation, AddPriceRecordMutationVariables>(AddPriceRecordDocument, options);
      }
export type AddPriceRecordMutationHookResult = ReturnType<typeof useAddPriceRecordMutation>;
export type AddPriceRecordMutationResult = Apollo.MutationResult<AddPriceRecordMutation>;
export type AddPriceRecordMutationOptions = Apollo.BaseMutationOptions<AddPriceRecordMutation, AddPriceRecordMutationVariables>;
export const GetAssetsDocument = gql`
    query GetAssets {
  assets {
    id
    type
    value
  }
}
    `;

/**
 * __useGetAssetsQuery__
 *
 * To run a query within a React component, call `useGetAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAssetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAssetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
      }
export function useGetAssetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
        }
export function useGetAssetsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAssetsQuery, GetAssetsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAssetsQuery, GetAssetsQueryVariables>(GetAssetsDocument, options);
        }
export type GetAssetsQueryHookResult = ReturnType<typeof useGetAssetsQuery>;
export type GetAssetsLazyQueryHookResult = ReturnType<typeof useGetAssetsLazyQuery>;
export type GetAssetsSuspenseQueryHookResult = ReturnType<typeof useGetAssetsSuspenseQuery>;
export type GetAssetsQueryResult = Apollo.QueryResult<GetAssetsQuery, GetAssetsQueryVariables>;
export const GetAssetsByTypeDocument = gql`
    query GetAssetsByType($type: String!) {
  assetByType(type: $type) {
    id
    type
    value
  }
}
    `;

/**
 * __useGetAssetsByTypeQuery__
 *
 * To run a query within a React component, call `useGetAssetsByTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAssetsByTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAssetsByTypeQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetAssetsByTypeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables> & ({ variables: GetAssetsByTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>(GetAssetsByTypeDocument, options);
      }
export function useGetAssetsByTypeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>(GetAssetsByTypeDocument, options);
        }
export function useGetAssetsByTypeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>(GetAssetsByTypeDocument, options);
        }
export type GetAssetsByTypeQueryHookResult = ReturnType<typeof useGetAssetsByTypeQuery>;
export type GetAssetsByTypeLazyQueryHookResult = ReturnType<typeof useGetAssetsByTypeLazyQuery>;
export type GetAssetsByTypeSuspenseQueryHookResult = ReturnType<typeof useGetAssetsByTypeSuspenseQuery>;
export type GetAssetsByTypeQueryResult = Apollo.QueryResult<GetAssetsByTypeQuery, GetAssetsByTypeQueryVariables>;
export const GetAssetWithHistoryDocument = gql`
    query GetAssetWithHistory($type: String!, $startDate: String, $endDate: String) {
  assetByType(type: $type) {
    id
    type
    value
    priceHistory(startDate: $startDate, endDate: $endDate) {
      id
      price
      timestamp
    }
  }
}
    `;

/**
 * __useGetAssetWithHistoryQuery__
 *
 * To run a query within a React component, call `useGetAssetWithHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAssetWithHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAssetWithHistoryQuery({
 *   variables: {
 *      type: // value for 'type'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useGetAssetWithHistoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables> & ({ variables: GetAssetWithHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>(GetAssetWithHistoryDocument, options);
      }
export function useGetAssetWithHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>(GetAssetWithHistoryDocument, options);
        }
export function useGetAssetWithHistorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>(GetAssetWithHistoryDocument, options);
        }
export type GetAssetWithHistoryQueryHookResult = ReturnType<typeof useGetAssetWithHistoryQuery>;
export type GetAssetWithHistoryLazyQueryHookResult = ReturnType<typeof useGetAssetWithHistoryLazyQuery>;
export type GetAssetWithHistorySuspenseQueryHookResult = ReturnType<typeof useGetAssetWithHistorySuspenseQuery>;
export type GetAssetWithHistoryQueryResult = Apollo.QueryResult<GetAssetWithHistoryQuery, GetAssetWithHistoryQueryVariables>;
export const GetPriceHistoryDocument = gql`
    query GetPriceHistory($assetId: String!, $startDate: String, $endDate: String, $limit: Int) {
  priceHistory(
    assetId: $assetId
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    id
    assetId
    price
    timestamp
  }
}
    `;

/**
 * __useGetPriceHistoryQuery__
 *
 * To run a query within a React component, call `useGetPriceHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPriceHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPriceHistoryQuery({
 *   variables: {
 *      assetId: // value for 'assetId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPriceHistoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPriceHistoryQuery, GetPriceHistoryQueryVariables> & ({ variables: GetPriceHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>(GetPriceHistoryDocument, options);
      }
export function useGetPriceHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>(GetPriceHistoryDocument, options);
        }
export function useGetPriceHistorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>(GetPriceHistoryDocument, options);
        }
export type GetPriceHistoryQueryHookResult = ReturnType<typeof useGetPriceHistoryQuery>;
export type GetPriceHistoryLazyQueryHookResult = ReturnType<typeof useGetPriceHistoryLazyQuery>;
export type GetPriceHistorySuspenseQueryHookResult = ReturnType<typeof useGetPriceHistorySuspenseQuery>;
export type GetPriceHistoryQueryResult = Apollo.QueryResult<GetPriceHistoryQuery, GetPriceHistoryQueryVariables>;