import "babel-polyfill";
import { ObjectID } from "mongodb";
import { PubSub } from "graphql-yoga";

const Mutation ={

  addTeam: async (parent, args, ctx, info) => {

    const { name } = args;
    const { client } = ctx;
    const db = client.db("La_Liga_Santander");
    const collection = db.collection("Equipo");

    const exist = await collection.findOne({name:name});

    if(!exist){

      const result = await collection.insertOne({name});

      return {
        name,
        _id: result.ops[0]._id
      };
    }

  },
  addMatch: async (parent, args, ctx, info) => {


    const { loc,vis,fecha,resultado,estado } = args;
    const { client,PubSub } = ctx;
    const db = client.db("La_Liga_Santander");

   
    

    if(loc != vis){

      const collection = db.collection("Equipo");

      const local = await collection.findOne({ _id: ObjectID(loc)});
      const visitor = await collection.findOne({ _id: ObjectID(vis)});

      if(local && visitor){

        const collection = db.collection("Partido");
        const result = await collection.insertOne({loc,vis,fecha,resultado,estado});

        return {

          fecha,
          resultado,
          estado,
          _id: result.ops[0]._id

        };
      }
   }
    
  },
  updateMatch: async (parent, args, ctx, info) => {

          const {_id ,resultado} = args;
          const { client, pubsub } = ctx;

    
          const db = client.db("La_Liga_Santander");
          let collection = db.collection("Partido");

          const exist = await collection.findOne({ _id: ObjectID(_id)});

          if (exist){

            await collection.updateOne({"_id":ObjectID(_id)},{$set:{resultado : resultado}});

        

            const match = await collection.findOne({ _id: ObjectID(_id)});

          

            pubsub.publish(
              _id,
              {
                tellmatch: match
              }
            );


          
             
             
            const id_local_team = match.loc;
            const id_visitor_team = match.vis;

           

            pubsub.publish(
              id_local_team,
              {
                tellteam: match
              }
            );

          
            
            pubsub.publish(
              id_visitor_team,
              {
                tellteam: match
              }
            );
             
            return match; 

          }else{

            console.log("partido inexistente");

          }
  
  },

}

export {Mutation as default}
