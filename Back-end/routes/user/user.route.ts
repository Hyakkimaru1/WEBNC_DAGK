import { User } from "./../../socket/User";
import express from "express";
import UserModel from "../../models/User.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import md5 from "md5";
import { auth, provider, providerfb } from "../../firebase/firebase";
import Board from "../../models/Board.model";
import RoomModel from "../../models/Room.model";
import MailerModel from "./../../models/sendMail.models";

const router = express.Router();
const primaryKey = config.PRIMARYKEY;

const routerUser = (io: any) => {
  router.get("/", (req, res) => {
    res.send("<h1>ROUTE USER</h1>");
  });

  router.post("/login", (req, res) => {
    // req.body has
    // username,password
    if (req.body.username && req.body.password) {
      req.body.password = md5(req.body.password);

      UserModel.find(
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
          UserModel.find(
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
                  UserModel.create(
                    {
                      user: req.body.username,
                      password: req.body.password,
                      avatar: "https://loremflickr.com/320/240/dog",
                      name: req.body.name,
                      isConfirm: true,
                      wins: 0,
                      cups: 0,
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
          console.log(error);
          res.sendStatus(401);
        });
    }
  });

  router.get("/loginagain", checkAuthorization, (req: any, res) => {
    UserModel.findById(req.authorization._id, (err, doc) => {
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
    UserModel.findOne(
      { user: req.body.user, isConfirm: true },
      async (err, doc) => {
        if (err) {
          res.sendStatus(400);
        } else {
          if (doc) {
            res.sendStatus(400);
          } else {
            req.body.password = md5(req.body.password);
            req.body.avatar = "https://loremflickr.com/320/240/dog";
            req.body.wins = 0;
            req.body.cups = 0;

            const currentDate = new Date();
            const countDownTime = 5 * 60000;
            const randomnumber =
              Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const dataUser = {
              ...req.body,
              isConfirm: false,
              codeConfirm: randomnumber,
            };
            const [result, resultSendMail] = await Promise.all([
              UserModel.create(dataUser),
              MailerModel.sendKeyToEmail(req.body.user, randomnumber),
            ]);

            if (resultSendMail?.accepted.length > 0) {
              setTimeout(async () => {
                const checkConfirm = await UserModel.findById(result._id);
                if (checkConfirm && !checkConfirm.isConfirm) {
                  await UserModel.deleteOne({ _id: result._id });
                }
              }, countDownTime);
            }
            res.send({ time: countDownTime, _id: result._id });
          }
        }
      }
    );
  });

  router.post("/confirm", (req, res) => {
    UserModel.findOne(
      { _id: req.body._id, codeConfirm: req.body.codeConfirm },
      async (err, doc) => {
        if (err) {
          return res.sendStatus(400);
        } else {
          if (doc) {
            doc.isConfirm = true;
            await doc.save();
            return res.sendStatus(201);
          } else {
            return res.sendStatus(401);
          }
        }
      }
    );
  });

  router.post("/board", checkAuthorization, (req: any, res) => {
    Board.create(
      {
        createBy: req.authorization.user,
        hasPassword: req.body.hasPassword,
        password: req.body.password,
        time: req.body.time,
      },
      (err, doc) => {
        if (err) {
          res.sendStatus(501);
        } else {
          res.send({ id: doc._id });
        }
      }
    );
  });

  router.post("/joinboard", checkAuthorization, (req: any, res) => {
    const uni = { _id: req.body._id, password: req.body.password };
    Board.find(uni, (err, doc) => {
      if (err) {
        res.sendStatus(404);
        return;
      } else if (doc.length > 0) {
        console.log("true");
        const room = io.sockets.adapter.rooms.get(req.body._id);
        if (!room?.peopleInRoom) {
          room.peopleInRoom = [];
        }
        room.peopleInRoom.push({
          socketId: req.body.socketId,
          user: req.authorization.user,
        });
        console.log(io.sockets.adapter.rooms.get(req.body._id));
        res.sendStatus(200);
        return;
      }
      res.sendStatus(400);
    });
  });

  router.post("/history", checkAuthorization, (req: any, res) => {
    RoomModel.find(
      {
        $or: [
          { "playerX.name": req.authorization.user },
          { "playerO.name": req.authorization.user },
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
  });

  router.get("/topranking", (req, res) => {
    UserModel.find({})
      .sort({ cup: "desc" })
      .limit(20)
      .exec((err, docs) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.send(docs);
      });
  });

  router.put("/changePassword", checkAuthorization, async (req: any, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const update = await UserModel.updateOne(
      { user: username, password: md5(password) },
      { password: md5(newPassword) }
    );
    if (update.nModified === 1) {
      res.sendStatus(200);
    } else res.sendStatus(404);
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

export default routerUser;
