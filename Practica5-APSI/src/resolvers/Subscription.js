import "babel-polyfill";
import { ObjectID } from "mongodb";
import { PubSub } from "graphql-yoga";
const Subscription = {

    tellteam:{

        subscribe: async (parent, args, ctx, info) => {

            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);

        }


    },

    tellmatch:{


        subscribe: async (parent, args, ctx, info) => {

            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);

        }

    }

}

export {Subscription as default}