import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    assets: [Asset]
  }

  type Asset {
    type: String
    value: Int
  }
`;

export default typeDefs;
