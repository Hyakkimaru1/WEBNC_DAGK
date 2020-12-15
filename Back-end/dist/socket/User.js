"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.userInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
const addUser = (user) => {
    var _a, _b;
    const name = (_a = user.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    const room = (_b = user.room) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
    const existUser = users.find((user) => user.room === room && user.name === name);
    if (existUser) {
        return { err: "username was taken!" };
    }
    if (user.name) {
        users.push(user);
        return user;
    }
    else
        return { err: "username was invalid!" };
};
exports.addUser = addUser;
const removeUser = (id) => {
    const idx = users.findIndex((user) => user.id === id);
    if (idx !== -1) {
        return users.splice(idx, 1)[0];
    }
};
exports.removeUser = removeUser;
const getUser = (id) => users.find((user) => user.id === id);
exports.getUser = getUser;
const userInRoom = (room) => users.filter((user) => user.room === room);
exports.userInRoom = userInRoom;
exports.getAllUsers = users;
// module.exports = { addUser, removeUser, getUser, userInRoom };
//# sourceMappingURL=User.js.map