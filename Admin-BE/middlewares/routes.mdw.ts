import userRoute from "../routes/admin/admin.route";

export default function (app: any): void {
  app.use("/admin", userRoute);
}
