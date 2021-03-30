import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { IncomingMessage, ServerResponse } from 'http';
import mongoose from 'mongoose';
import Cookies from 'cookies';

import { recipeQuery, recipeMutations } from './recipe';
import { userQuery, userMutations } from './user';
import { githubQuery } from './github';
import { roomQuery } from './room';

// Secret string that allows the API to securely sign cookies
// Signing a cookie forbids users from manually tampering with it
const keys = process.env.COOKIE_SIGN_KEYS.split(',');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: userQuery,
      room: roomQuery,
      github: githubQuery,
      recipe: recipeQuery
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      user: userMutations,
      recipe: recipeMutations
    }
  })
});

mongoose.set('useNewUrlParser', true);

mongoose.set('useFindAndModify', false);

mongoose.set('useCreateIndex', true);

mongoose.set('useUnifiedTopology', true);

mongoose.connect(`mongodb://127.0.0.1/${process.env.MONGODB}`);

mongoose.connection.on('error', (err) => console.error('MongoDB Error', err));

export default async (
  request: IncomingMessage,
  response: ServerResponse,
  body: { query: string; variables: any } | null
) => {
  const cookies = new Cookies(request, response, { keys });

  const result = await graphql(
    schema,
    body?.query || '',
    undefined,
    { cookies },
    body?.variables || {}
  );

  response.writeHead(200);

  response.end(JSON.stringify(result));
};