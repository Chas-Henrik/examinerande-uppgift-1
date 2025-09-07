import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { typeDefs } from "./graphql/typedefs.js";
import { resolvers } from "./graphql/resolvers.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();
const app = express();
app.use(express.json());

// Setup Apollo Server
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(
	"/graphql",
	expressMiddleware(apollo, {
		context: async () => ({}),
	})
);

const PORT = 3000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`GraphQL is running on http://localhost:${PORT}`);
		});
	})
	.catch(console.error);