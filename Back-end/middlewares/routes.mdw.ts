
import userRoute from "../routes/user/user.route";
import adminRoute from "../routes/admin/admin.route";

export default function (app,io) {
  app.use("/user", userRoute(io));
  app.use("/admin", adminRoute(io));
}

