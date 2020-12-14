import userRoute from '../routes/user/user.route';
import roomRoute from '../routes/room/room.route';

export default function (app) {
    app.use('/user', userRoute);
    app.use('/room', roomRoute);
};