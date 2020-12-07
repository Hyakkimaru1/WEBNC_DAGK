import userRoute from '../routes/user/user.route';

export default function (app) {
    app.use('/user', userRoute);
};