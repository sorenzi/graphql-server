import * as path from 'path';
import * as glob from 'glob';

import { createTypeormConnection } from './utils/createTypeormConnection';
import { JWTSecret } from './utils/jwtUtil';
import validationMiddleware from './validationMiddleware';

const { ApolloServer } = require('apollo-server-express');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('graphql-tools');
const express = require('express');

export const startServer = async () => {
  const app = express();

  // merge all our graphql typedefs and resolvers across different folders
  const pathToModules = path.join(__dirname, './modules');
  const allSchemas = glob.sync(`${pathToModules}/**/**/*.graphql`).map((x) => {
    return loadFilesSync(x, { extensions: ['graphql'] });
  });

  const typeDefs = mergeTypeDefs(allSchemas);
  const resolverHandlers = glob
    .sync(`${pathToModules}/**/**/resolver.?s`)
    .map((x) => {
      return require(x);
    });

  const allResolvers = resolverHandlers.map((handler) => {
    return handler.resolver;
  });

  const resolvers = mergeResolvers(allResolvers);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  app.use(express.json());
  const server = new ApolloServer({
    schema,
    context: validationMiddleware(JWTSecret)
  });

  server.applyMiddleware({ app });

  // Connecting to the db
  await createTypeormConnection();

  const expressServer = app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
  return expressServer;
};
