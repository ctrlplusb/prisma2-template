import { GraphQLServer } from 'graphql-yoga'
import { schema } from './schema'
import { createContext } from './context'
// hello
new GraphQLServer({
  schema,
  context: createContext,
}).start(() => console.log(`🚀  Server ready at: http://localhost:4000`))
