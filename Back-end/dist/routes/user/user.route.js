"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const md5_1 = __importDefault(require("md5"));
const firebase_1 = require("../../firebase/firebase");
const router = express_1.default.Router();
const primaryKey = config_1.default.PRIMARYKEY;
router.get("/", (req, res) => {
    res.send("<h1>ROUTE USER</h1>");
});
router.post("/login", (req, res) => {
    // req.body has
    // username,password
    if (req.body.username && req.body.password) {
        req.body.password = md5_1.default(req.body.password);
        User_model_1.default.find({ user: req.body.username, password: req.body.password }, (err, docs) => {
            if (err) {
                res.sendStatus(503);
            }
            else {
                // send jwt
                if (docs.length > 0) {
                    docs[0].password = "";
                    jsonwebtoken_1.default.sign(docs[0].toJSON(), primaryKey, (err, token) => {
                        if (err) {
                            res.sendStatus(503);
                        }
                        else {
                            console.log("token", token);
                            res.send({
                                token,
                                _id: docs[0]._id,
                                user: docs[0].user,
                                avatar: docs[0].avatar,
                                name: docs[0].name,
                                old: docs[0].old,
                            });
                        }
                    });
                }
                else {
                    res.sendStatus(401);
                }
            }
        });
    }
    else {
        res.sendStatus(404);
    }
});
router.post("/loginGGFB", (req, res) => {
    if (req.body.username && req.body.password) {
        req.body.password = md5_1.default(req.body.password);
        // Build Firebase credential with the Google ID token.
        let credential;
        if (req.body.loginfb) {
            credential = firebase_1.providerfb.credentital({
                accessToken: req.body.idToken,
            });
        }
        else {
            credential = firebase_1.provider.credential(req.body.idToken);
        }
        // Sign in with credential from the Google user.
        firebase_1.auth
            .signInWithCredential(credential)
            .then((data) => {
            User_model_1.default.find({ user: req.body.username, password: req.body.password }, (err, docs) => {
                if (err) {
                    res.sendStatus(503);
                }
                else {
                    // send jwt
                    if (docs.length > 0) {
                        docs[0].password = "";
                        jsonwebtoken_1.default.sign(docs[0].toJSON(), primaryKey, (err, token) => {
                            if (err) {
                                res.sendStatus(503);
                            }
                            else {
                                res.send({
                                    token,
                                    _id: docs[0]._id,
                                    user: docs[0].user,
                                    avatar: docs[0].avatar,
                                    name: docs[0].name,
                                    old: docs[0].old,
                                });
                            }
                        });
                    }
                    else {
                        User_model_1.default.create({
                            user: req.body.username,
                            password: req.body.password,
                            avatar: req.body.avatar,
                            name: req.body.name,
                        }, (err, docs) => {
                            if (err) {
                                res.sendStatus(503);
                            }
                            else {
                                docs.password = "";
                                jsonwebtoken_1.default.sign(docs.toJSON(), primaryKey, (err, token) => {
                                    if (err) {
                                        res.sendStatus(503);
                                    }
                                    else {
                                        res.send({
                                            token,
                                            _id: docs._id,
                                            user: docs.user,
                                            avatar: docs.avatar,
                                            name: docs.name,
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        })
            .catch(function (error) {
            console.log(error);
            res.sendStatus(401);
        });
    }
});
router.get("/loginagain", checkAuthorization, (req, res) => {
    User_model_1.default.findById(req.authorization._id, (err, doc) => {
        if (err) {
            res.sendStatus(404);
        }
        else {
            res.send({
                _id: doc._id,
                user: doc.user,
                avatar: doc.avatar,
                name: doc.name,
                old: doc.old,
            });
        }
    });
});
router.post("/register", (req, res) => {
    User_model_1.default.findOne({ user: req.body.username }, (err, doc) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            if (doc) {
                res.sendStatus(400);
            }
            else {
                req.body.password = md5_1.default(req.body.password);
                req.body.avatar = "";
                User_model_1.default.create(req.body, (err) => {
                    if (err) {
                        res.sendStatus(503);
                    }
                    else
                        res.sendStatus(201);
                });
            }
        }
    });
});
function checkAuthorization(req, res, next) {
    // check header contain beader
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        const token = req.headers.authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, primaryKey, function (err, decoded) {
            if (err) {
                res.sendStatus(401);
                return;
            }
            else {
                req.authorization = decoded;
            }
        });
        next();
    }
    else {
        res.sendStatus(403);
    }
}
exports.default = router;
//# sourceMappingURL=user.route.js.map