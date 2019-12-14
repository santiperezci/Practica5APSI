import { MongoClient } from "mongodb";
import { GraphQLServer ,PubSub} from "graphql-yoga";
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Match from './resolvers/Match'
import Query from './resolvers/Query'
import "babel-polyfill";

const usr = "sperezcirerap";
const pwd = "spc99";
const url = "cluster0-f5jg6.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  


  const resolvers = {

    Query,
    Mutation,
    Match,
    Subscription

  };
  const server = new GraphQLServer({ 
    typeDefs : './src/schema.graphql',
    resolvers, 
    context

  });

  const options = {
    port: 8005
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    const pubsub = new PubSub();
    runGraphQLServer({ client,pubsub });
  } catch (e) {
    console.log(e);
    client.close();
  }
};

runApp();


