"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_mdw_1 = __importDefault(require("./middlewares/routes.mdw"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
// rest of the code remains same
const app = express_1.default();
const PORT = process.env.PORT || 8001;
// middlewares
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.json());
// Server.buildServices(app);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
// Key
const connect_URL = "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority";
mongoose_1.default.connect(connect_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose_1.default.connection.once("open", () => {
    console.log("connected");
});
socket_1.default(io);
routes_mdw_1.default(app);
app.get("/", (req, res) => res.send("Typescript"));
server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map