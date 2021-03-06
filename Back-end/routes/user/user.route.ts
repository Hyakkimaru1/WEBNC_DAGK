import express from "express";
import UserModel from "../../models/User.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import md5 from "md5";
import { auth, provider, providerfb } from "../../firebase/firebase";
import Board from "../../models/Board.model";
import RoomModel from "../../models/Room.model";
import MailerModel from "./../../models/sendMail.models";
import TokenPasswordModel from "../../models/TokenPassword.model";
import moment from "moment";
import ChatModel from "../../models/Chat.model";

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
              // Check if user is disabled
              if (!docs[0].isActive) res.sendStatus(403);
              else {
                docs[0].password = "";
                jwt.sign(
                  docs[0].toJSON(),
                  primaryKey,
                  (err: any, token: any) => {
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
                  }
                );
              }
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

  router.get("/id/:id", (req, res) => {
    UserModel.findById(req.params.id, (err, doc) => {
      if (err) return res.sendStatus(404);
      if (doc) {
        const userProfile = { ...doc._doc };
        delete userProfile.password;
        delete userProfile.isActive;
        delete userProfile.isConfirm;
        delete userProfile.__v;
        delete userProfile.codeConfirm;
        return res.send(userProfile);
      } else return res.sendStatus(403);
    });
  });

  router.post("/loginGGFB", (req, res) => {
    if (req.body.username && req.body.password) {
      req.body.password = md5(req.body.password);
      // Build Firebase credential with the Google ID token.
      let credential;
      if (req.body.loginfb) {
        credential = providerfb.credential({
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
                  if (!docs[0].isActive) res.sendStatus(403);
                  else {
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
                  }
                } else {
                  const id = Math.floor(Math.random() * 2220);
                  const joinDate = moment().format("MM-DD-YYYY");
                  UserModel.create(
                    {
                      user: req.body.username,
                      password: req.body.password,
                      avatar: req.body.avatar,
                      name: req.body.name,
                      isConfirm: true,
                      joinDate,
                      wins: 0,
                      cups: 0,
                      isActive: true,
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
    try {
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
    } catch (error) {
      console.log("error", error);
    }
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
            const id = Math.floor(Math.random() * 2220);
            req.body.password = md5(req.body.password);
            req.body.avatar = `https://picsum.photos/id/${id}/200/300`;
            req.body.wins = 0;
            req.body.cups = 0;

            const countDownTime = 5 * 60000;
            const randomnumber =
              Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const joinDate = moment().format("MM-DD-YYYY");
            const dataUser = {
              ...req.body,
              joinDate,
              isActive: true,
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
    try {
      const name = req.authorization.user;
      const allRoom = io.sockets.adapter.rooms;
      let f = false;
      for (let index = 0; index < allRoom.length; index++) {
        const room = allRoom[index];
        const info = room.peopleInRoom;
        if (info) {
          const idx = info.findIndex((user: any) => user.user == name);
          if (idx !== -1) {
            res.send(400);
            f = true;
            return;
          }
        }
      }
      Board.create(
        {
          createBy: name,
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
    } catch (error) {
      res.sendStatus(400);
    }
  });

  router.post("/joinboard", checkAuthorization, (req: any, res) => {
    try {
      const uni = { _id: req.body._id, password: req.body.password };
      Board.find(uni, async (err, doc) => {
        if (err) {
          res.sendStatus(404);
          return;
        } else if (doc.length > 0) {
          const room = io.sockets.adapter.rooms.get(req.body._id);
          if (!room?.peopleInRoom) {
            room.peopleInRoom = [];
          }
          const index = await room.peopleInRoom.findIndex(
            (ele) => ele.user === req.authorization.user
          );
          if (index === -1) {
            room.peopleInRoom.push({
              socketId: 1,
              user: req.authorization.user,
            });
          } else {
            room.peopleInRoom[index].socketId++;
          }
          res.sendStatus(200);
          return;
        }
        res.sendStatus(400);
      });
    } catch (error) {
      res.sendStatus(404);
      console.log("error", error);
    }
  });

  router.post("/history", checkAuthorization, (req: any, res) => {
    RoomModel.find({
      $or: [
        { "playerX.name": req.authorization.user },
        { "playerO.name": req.authorization.user },
      ],
    }).exec(async (err, docs: any) => {
      if (err) {
        res.sendStatus(404);
      } else {
        const dataChats = {};
        for (let index = 0; index < docs.length; index++) {
          const chats = await ChatModel.findOne({ roomId: docs[index].roomId });
          if (chats && chats.messages.length > 0) {
            const newChats = await chats.messages.slice(
              docs[index].startChat,
              docs[index].endChat
            );
            dataChats[docs[index]._id] = newChats;
          }
        }
        res.send({ docs, dataChats });
      }
    });
  });

  router.get("/topranking", checkAuthorization, async (req: any, res) => {
    const [listTops, userRanking] = await Promise.all([
      UserModel.find({}).sort({ cups: "desc" }).select("-password"),
      UserModel.findById(req.authorization._id).select("-password"),
    ]);
    const rank = listTops.findIndex((ele) => ele.user === userRanking.user) + 1;
    res.send({ listTops: listTops.slice(0, 15), userRanking, rank });
  });

  router.put("/changePassword", checkAuthorization, async (req: any, res) => {
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

  router.post("/forgotPassword", async (req: any, res) => {
    if (req.body.email) {
      UserModel.findOne({ user: req.body.email }, async (err, doc) => {
        if (err) return res.sendStatus(400);
        if (doc) {
          const dataToken = { _idUser: doc._id, user: doc.user };
          await TokenPasswordModel.deleteOne({ dataToken });
          const data = await TokenPasswordModel.create(dataToken);
          const resultSendMail = await MailerModel.sendForgetPasswordToEmail(
            doc.user,
            data._id
          );
          if (resultSendMail?.accepted.length > 0) {
            res.sendStatus(201);
            setTimeout(async () => {
              await TokenPasswordModel.deleteOne(dataToken);
            }, 3600000);
          } else res.sendStatus(500);
        }
      });
    } else {
      res.sendStatus(400);
    }
  });

  router.put("/password_reset/:token", async (req: any, res) => {
    if (req.body.password) {
      await TokenPasswordModel.findById(req.params.token, async (err, doc) => {
        if (err) return res.sendStatus(400);
        if (doc) {
          const user = await UserModel.findById(doc._idUser);
          if (user) {
            await TokenPasswordModel.deleteOne(doc);
            user.password = md5(req.body.password);
            user.save();
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
        }
      });
    } else {
      res.sendStatus(400);
    }
  });

  router.put("/update", checkAuthorization, async (req: any, res) => {
    const update = await UserModel.updateOne(
      { _id: req.authorization._id },
      req.body
    );
    if (update.ok) {
      return res.sendStatus(200);
    }
    return res.sendStatus(500);
  });

  router.post("/token", checkAuthorization, async (req: any, res) => {
    await UserModel.findById(req.authorization._id, (err, doc) => {
      if (err) {
        res.sendStatus(503);
        return;
      }
      if (doc) {
        if (!doc.isActive) res.send(false);
        else res.send(true);
      } else res.send(false);
    });
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
