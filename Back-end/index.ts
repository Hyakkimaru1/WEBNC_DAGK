import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routesMdw from "./middlewares/routes.mdw";
import bodyParser from "body-parser";

import http from "http";
import { Server, Socket } from "socket.io";
import socket from "./socket";
// rest of the code remains same
const app = express();
const PORT = process.env.PORT || 8001;

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Server.buildServices(app);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Key
const connect_URL =
  "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority";

mongoose.connect(connect_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.once("open", () => {
  console.log("connected");
});
socket(io);
routesMdw(app, io);

app.get("/", (req, res) => res.send("Typescript"));
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
