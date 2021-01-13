import express from "express";
import adminModel from "../../models/Admin.model";
import userModel from "../../models/User.model";
import RoomModel from "../../models/Room.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import md5 from "md5";
import { auth, provider, providerfb } from "../../firebase/firebase";
import ChatModel from "../../models/Chat.model";

const router = express.Router();
const primaryKey = config.PRIMARYKEY;

const routerAdmin = (io: any) => {
  router.get("/", (req, res) => {
    res.send("<h1>ROUTE USER</h1>");
  });

  router.post("/login", (req, res) => {
    // req.body has
    // username,password
    if (req.body.username && req.body.password) {
      req.body.password = md5(req.body.password);

      adminModel.find(
        { user: req.body.username, password: req.body.password },
        (err, docs: any) => {
          if (err) {
            res.sendStatus(503);
          } else {
            // send jwt
            if (docs.length > 0) {
              docs[0].password = "";
              jwt.sign(docs[0].toJSON(), primaryKey, (err: any, token: any) => {
                if (err) {
                  res.sendStatus(503);
                } else {
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
            } else {
              res.sendStatus(401);
            }
          }
        }
      );
    } else {
      res.sendStatus(404);
    }
  });

  router.post("/loginGGFB", (req, res) => {
    if (req.body.username && req.body.password) {
      req.body.password = md5(req.body.password);
      // Build Firebase credential with the Google ID token.
      let credential;
      if (req.body.loginfb) {
        credential = (providerfb as any).credentital({
          accessToken: req.body.idToken,
        });
      } else {
        credential = (provider as any).credential(req.body.idToken);
      }

      // Sign in with credential from the Google user.
      auth
        .signInWithCredential(credential)
        .then((data) => {
          adminModel.find(
            { user: req.body.username, password: req.body.password },
            (err, docs: any) => {
              if (err) {
                res.sendStatus(503);
              } else {
                // send jwt
                if (docs.length > 0) {
                  docs[0].password = "";
                  jwt.sign(docs[0].toJSON(), primaryKey, (err, token) => {
                    if (err) {
                      res.sendStatus(503);
                    } else {
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
                } else {
                  adminModel.create(
                    {
                      user: req.body.username,
                      password: req.body.password,
                      avatar: req.body.avatar,
                      name: req.body.name,
                    },
                    (err, docs) => {
                      if (err) {
                        res.sendStatus(503);
                      } else {
                        docs.password = "";
                        jwt.sign(docs.toJSON(), primaryKey, (err, token) => {
                          if (err) {
                            res.sendStatus(503);
                          } else {
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
                    }
                  );
                }
              }
            }
          );
        })
        .catch(function (error) {
          res.sendStatus(401);
        });
    }
  });

  router.get("/loginagain", checkAuthorization, (req: any, res) => {
    adminModel.findById(req.authorization._id, (err, doc) => {
      if (err) {
        res.sendStatus(404);
      } else {
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
    adminModel.findOne({ user: req.body.user }, (err, doc) => {
      if (err) {
        res.sendStatus(400);
      } else {
        if (doc) {
          res.sendStatus(400);
        } else {
          req.body.password = md5(req.body.password);
          req.body.old = 0;
          req.body.avatar = "";
          adminModel.create(req.body, (err, doc) => {
            if (err) {
              res.sendStatus(503);
            } else res.sendStatus(201);
          });
        }
      }
    });
  });

  router.get("/getusers", (req: any, res) => {
    try {
      if (req.query.typeValue === "") {
        userModel.find((error, doc) => {
          if (error) {
            res.sendStatus(404);
          } else {
            res.send(doc);
          }
        });
      } else {
        const input = req.query.typeValue;
        userModel.find(
          {
            $or: [
              { name: { $regex: ".*" + input + ".*" } },
              { user: { $regex: ".*" + input + ".*" } },
              { name: { $regex: input + ".*" } },
            ],
          },
          (error, doc) => {
            if (error) {
              res.sendStatus(404);
            } else {
              res.send(doc);
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/disableuser", (req, res) => {
    try {
      userModel.findOneAndUpdate(
        { user: req.body.username },
        { isActive: !req.body.status },
        {},
        (err, doc) => {
          if (err) {
            res.sendStatus(404);
          } else {
            res.send(doc);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  router.get("/getuserdetail", (req: any, res) => {
    try {
      if (req.query.id === "") {
        userModel.find((error, doc) => {
          if (error) {
            res.sendStatus(404);
          } else {
            res.send(doc);
          }
        });
      } else {
        const input = req.query.id;
        userModel.find({ _id: input }, (error, doc) => {
          if (error) {
            res.sendStatus(404);
          } else {
            res.send(doc);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.get("/getuserhistory", (req: any, res) => {
    if (req.query.id === "") {
      RoomModel.find((error, doc) => {
        if (error) {
          res.sendStatus(404);
        } else {
          res.send(doc);
        }
      });
    } else {
      let username = null;
      userModel.find({ _id: req.query.id }, (error, doc) => {
        if (error) {
          res.sendStatus(404);
        } else {
          if (doc.length > 0) {
            if (doc[0].user) username = doc[0].user;
            RoomModel.find(
              {
                $or: [
                  { "playerX.name": username },
                  { "playerO.name": username },
                ],
              },
              (err, doc) => {
                if (err) {
                  res.sendStatus(404);
                } else {
                  res.send(doc);
                }
              }
            );
          } else res.sendStatus(404);
        }
      });
    }
  });

  router.get("/gethistorydetail", (req: any, res) => {
    try {
      let startChat = null;
      let endChat = null;
      let room = null;
      if (req.query.id === "") {
        res.sendStatus(404);
      } else {
        RoomModel.findOne({ _id: req.query.id }, (err, doc) => {
          if (err) {
            res.sendStatus(404);
            return;
          } else {
            startChat = doc.startChat;
            endChat = doc.endChat;
            room = doc.roomId;
          }
          ChatModel.findOne({ roomId: room }, (err, doc) => {
            if (err) {
              res.sendStatus(404);
            } else {
              if (doc && doc.messages) {
                let chat = doc.messages;
                res.send(chat.slice(startChat, endChat));
              } else res.send(null);
            }
          });
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  function checkAuthorization(req, res, next) {
    // check header contain beader
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, primaryKey, function (err, decoded) {
        if (err) {
          res.sendStatus(401);
          return;
        } else {
          req.authorization = decoded;
        }
      });
      next();
    } else {
      res.sendStatus(403);
    }
  }
  return router;
};

export default routerAdmin;
