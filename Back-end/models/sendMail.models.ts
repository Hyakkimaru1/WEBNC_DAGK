import mailer from "nodemailer";
import { BASE_URL_CLIENT } from "../config";

const transporter = mailer.createTransport({
  // config mail server
  service: "Gmail",
  auth: {
    user: "carodack3d@gmail.com",
    pass: "123456abc!@#",
  },
});

type DataMail = {
  otp: string;
  email: string;
};

const MailerModel = {
  sendOTP: (email) => {
    const data: DataMail = {
      otp: "",
      email,
    };

    //generate random otp
    var i;
    var num;
    for (i = 0; i < 6; i++) {
      num = Math.floor(Math.random() * 10);
      data.otp += num.toString();
    }
    //gui otp

    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "Test",
      to: data.email,
      subject: "Test Nodemailer",
      text: "You recieved message from " + "systemauction2019@gmail.com",
      html:
        "<p>You have got a otp for verifying your account</b><ul><li>OTP code:" +
        data.otp +
        "</li></ul>",
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });

    return data;
  },
  sendKeyToEmail: (email, key) => {
    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "Caro-3D",
      to: email,
      subject: "Mã xác minh tài khoản",
      text: "Mail được gửi từ Caro-3D",
      html:
        "<p>You have got a otp for verifying your account</b><div>OTP code:<h2>" +
        key +
        "</h2></div>",
    };

    return transporter.sendMail(mainOptions);
  },
  sendForgetPasswordToEmail: (email, token) => {
    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: "Caro-3D",
      to: email,
      subject: "Please reset your password",
      text: "Mail được gửi từ Caro-3D",
      html:
        `<p>We heard that you lost your Caro3D password. Sorry about that!</p>

        <p>But don’t worry! You can use the following link to reset your password:</p>
        <br/>
        ${BASE_URL_CLIENT}/password_reset/${token}
        <br/>
        <p>If you don’t use this link within 1 hour, it will expire.</p>`
    };
   
    return transporter.sendMail(mainOptions);
  },
};

export default MailerModel;
