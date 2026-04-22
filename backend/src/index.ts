import cors from "cors";
import express from "express";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/criarSchema.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const yoga = createYoga({ schema });
app.use("/graphql", yoga);

app.listen(port, () => {
  console.log(`API em http://localhost:${port}`);
  console.log(`GraphQL (GraphiQL) em http://localhost:${port}/graphql`);
});
