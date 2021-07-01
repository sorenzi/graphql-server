import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import * as path from 'path';
import * as glob from 'glob';

import { createTypeormConnection } from './utils/createTypeormConnection';
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('graphql-tools');

export const startServer = async () => {
  const pathToModules = path.join(__dirname, './modules');

  const allSchemas = glob.sync(`${pathToModules}/**/**/*.graphql`).map((x) => {
    return loadFilesSync(x, { extensions: ['graphql'] });
  });

  const typeDefs = mergeTypeDefs(allSchemas);
  const allResolvers = glob
    .sync(`${pathToModules}/**/**/resolvers.?s`)
    .map((x) => {
      return require(x).resolvers;
    });
  const resolvers = mergeResolvers(allResolvers);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  const server = new ApolloServer({ schema });
  await createTypeormConnection();
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
