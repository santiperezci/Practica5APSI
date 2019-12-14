const Query = {
    
    getPartidos: async (parent, args, ctx, info) => {

        const { client } = ctx;
        const db = client.db("La_Liga_Santander");
        const collection = db.collection("Partido");

        const result = await collection.find({}).toArray();
        return result;
    },
    getEquipos: async (parent, args, ctx, info) => {

        const { client } = ctx;
        const db = client.db("La_Liga_Santander");
        const collection = db.collection("Equipo");
  
    
        const result = await collection.find({}).toArray();
        return result;
    },
}

export {Query as default}
