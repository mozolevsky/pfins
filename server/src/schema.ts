import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    assets: [Asset]
    asset(id: Int): Asset
    assetByType(type: String): [Asset]
  }

  type Mutation {
    addAsset(asset: AssetInput): Asset
    updateAsset(asset: AssetUpdateInput): Asset
    deleteAsset(id: Int): Int
  }

  type Asset {
    id: Int
    type: String
    value: Int
  }

  input AssetInput {
    id: Int
    type: String
    value: Int
  }

  input AssetUpdateInput {
    id: Int!
    type: String
    value: Int
  }
`;

export default typeDefs;
