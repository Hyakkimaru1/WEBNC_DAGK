"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_mdw_1 = __importDefault(require("./middlewares/routes.mdw"));
// rest of the code remains same
const app = express_1.default();
const PORT = 8001 || process.env.PORT;
//middlewares
app.use(express_1.default.json());
app.use(cors_1.default());
//Key
const connect_URL = "mongodb+srv://admin:admin@cluster0.0n2op.mongodb.net/CARO_DACK?retryWrites=true&w=majority";
mongoose_1.default.connect(connect_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose_1.default.connection.once("open", () => {
    console.log("connected");
});
routes_mdw_1.default(app);
app.get("/", (req, res) => res.send("Typescript"));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map