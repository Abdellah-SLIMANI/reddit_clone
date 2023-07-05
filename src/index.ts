import { MikroORM } from "@mikro-orm/core";
import { PORT, __prod__ } from "./constants";
import microConfigs from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/Post";

const main = async () => {
    const orm = await MikroORM.init(microConfigs);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    })
    await apolloServer.start();
    apolloServer.applyMiddleware({app})
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    })
}

main().catch(err => {
    console.error(err)
});