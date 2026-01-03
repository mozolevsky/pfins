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
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
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
  deleteAsset?: Maybe<Scalars['String']['output']>;
  updateAsset?: Maybe<Asset>;
};


export type MutationAddAssetArgs = {
  asset?: InputMaybe<AssetInput>;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateAssetArgs = {
  asset?: InputMaybe<AssetUpdateInput>;
};

export type Query = {
  __typename?: 'Query';
  asset?: Maybe<Asset>;
  assetByType?: Maybe<Array<Maybe<Asset>>>;
  assets?: Maybe<Array<Maybe<Asset>>>;
};


export type QueryAssetArgs = {
  id: Scalars['String']['input'];
};


export type QueryAssetByTypeArgs = {
  type: Scalars['String']['input'];
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

export type GetAssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAssetsQuery = { __typename?: 'Query', assets?: Array<{ __typename?: 'Asset', id?: string | null, type?: string | null, value?: number | null } | null> | null };


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