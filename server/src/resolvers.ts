const mockedAssets = [
  { type: "Cash", value: 1000 },
  { type: "Stock", value: 2000 },
  { type: "Real Estate", value: 3000 },
  { type: "Crypto", value: 4000 },
];

export const resolvers = {
  Query: {
    assets: () => mockedAssets,
  },
};
