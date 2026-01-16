import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  deletePriceRecord: Scalars['Int']['output'];
  updateAsset?: Maybe<Asset>;
  updatePriceRecord?: Maybe<PriceHistory>;
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


export type MutationDeletePriceRecordArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateAssetArgs = {
  asset?: InputMaybe<AssetUpdateInput>;
};


export type MutationUpdatePriceRecordArgs = {
  id: Scalars['Int']['input'];
  price: Scalars['Float']['input'];
  timestamp: Scalars['String']['input'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Asset: ResolverTypeWrapper<Asset>;
  AssetInput: AssetInput;
  AssetUpdateInput: AssetUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PriceHistory: ResolverTypeWrapper<PriceHistory>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Asset: Asset;
  AssetInput: AssetInput;
  AssetUpdateInput: AssetUpdateInput;
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  PriceHistory: PriceHistory;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
};

export type AssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['PriceHistory']>>>, ParentType, ContextType, Partial<AssetPriceHistoryArgs>>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, Partial<MutationAddAssetArgs>>;
  addPriceRecord?: Resolver<Maybe<ResolversTypes['PriceHistory']>, ParentType, ContextType, RequireFields<MutationAddPriceRecordArgs, 'assetId' | 'price'>>;
  deleteAsset?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'id'>>;
  deletePriceRecord?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationDeletePriceRecordArgs, 'id'>>;
  updateAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, Partial<MutationUpdateAssetArgs>>;
  updatePriceRecord?: Resolver<Maybe<ResolversTypes['PriceHistory']>, ParentType, ContextType, RequireFields<MutationUpdatePriceRecordArgs, 'id' | 'price' | 'timestamp'>>;
};

export type PriceHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['PriceHistory'] = ResolversParentTypes['PriceHistory']> = {
  assetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  asset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetArgs, 'id'>>;
  assetByType?: Resolver<Maybe<Array<Maybe<ResolversTypes['Asset']>>>, ParentType, ContextType, RequireFields<QueryAssetByTypeArgs, 'type'>>;
  assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Asset']>>>, ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['PriceHistory']>>>, ParentType, ContextType, RequireFields<QueryPriceHistoryArgs, 'assetId'>>;
};

export type Resolvers<ContextType = any> = {
  Asset?: AssetResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PriceHistory?: PriceHistoryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

