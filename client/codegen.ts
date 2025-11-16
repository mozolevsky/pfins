import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // You can switch between these options:
  schema: "http://localhost:4000", // Alternative: "../server/src/schema.graphql"
  documents: ["src/**/*.{ts,tsx,graphql}"],
  generates: {
    "src/generated/graphql-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        apolloReactHooksImportFrom: '@apollo/client/react',
      },
    },
  },
};

export default config;

