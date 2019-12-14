import "babel-polyfill";
import { ObjectID } from "mongodb";
import { PubSub } from "graphql-yoga";
const Match = {

    equipos:async (parent, args, ctx, info)=>{
  
        const id_local= parent.loc;
        const id_visitante= parent.vis;
        
        const { client } = ctx;
        const db = client.db("La_Liga_Santander");
        const collection = db.collection("Equipo");


        const local = await collection.findOne({ _id: ObjectID(id_local)});
        const visitante = await collection.findOne({ _id: ObjectID(id_visitante)});

        const result = [];
        
        result.push(local);   
        result.push(visitante);
          
        return result;
    },
}

export {Match as default}
