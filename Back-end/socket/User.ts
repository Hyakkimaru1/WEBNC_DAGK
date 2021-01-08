export type User = {
  id?: string;
  avatar?: string;
  name?: string;
  room?: string;
};

const users: User[] = [];

export const addUser = (user: User) => {
  const name = user.name;
  const id = user.id;

  const existUser = users.find((user: User) => user.name === name);
  if (existUser) {
    return { err: "username was taken!" };
  }
  if (user.name) {
    users.push(user);
    return user;
  } else return { err: "username was invalid!" };
};

export const removeUser = (id: string) => {
  const idx = users.findIndex((user: User) => user.id === id);
  if (idx !== -1) {
    return users.splice(idx, 1)[0];
  }
};
export const updateUser = (u: User) => {
  const idx = users.findIndex((user: User) => user.name === u.name);
  if (idx !== -1) {
    return users.splice(idx, 1, u);
  } else {
    users.push(u);
  }
  return u;
};

export const getUser = (id: string) =>
  users.find((user: User) => user.id === id);

export const getUserByName = (name: string) =>
  users.find((user: User) => user.name === name);

export const userInRoom = (room: string) =>
  users.filter((user: User) => user.room === room);

export const getAllUsers = users;
// module.exports = { addUser, removeUser, getUser, userInRoom };
