export type User = {
  id?: string;
  name?: string;
  room?: string;
};

const users: User[] = [];

export const addUser = (user: User) => {
  const name = user.name?.trim().toLowerCase();
  const room = user.room?.trim().toLowerCase();

  const existUser = users.find(
    (user: User) => user.room === room && user.name === name
  );
  if (existUser) {
    return { err: "username was taken!" };
  }
  users.push(user);
  return user;
};

export const removeUser = (id: string) => {
  const idx = users.findIndex((user: User) => user.id === id);
  if (idx !== -1) {
    return users.splice(idx, 1)[0];
  }
};

export const getUser = (id: string) =>
  users.find((user: User) => user.id === id);

export const userInRoom = (room: string) =>
  users.filter((user: User) => user.room === room);

// module.exports = { addUser, removeUser, getUser, userInRoom };
