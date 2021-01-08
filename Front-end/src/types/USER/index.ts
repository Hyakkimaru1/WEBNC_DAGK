type USER = {
  avatar: string;
  name: string;
  user: string;
  wins?:number;
  joinDate?:Date;
  cups?:number;
  _id: string;
};

export const userInitial = {
  avatar: "",
  name: "",
  user:"",
  wins:0,
  cups:0,
  _id:"",
}

export default USER;