import React, { useState, useContext, useEffect } from "react";
import "./style.scss";
import { Button, Snackbar, TextField, CircularProgress } from "@material-ui/core";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@material-ui/lab";
import * as yup from "yup";
import { productAPI } from "@/configs/productAPI";
import { toast } from "react-toastify";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useHistory } from 'react-router-dom';

const schema = yup.object().shape({
  codeconfirm: yup
    .string()
    .required("This field is required"),
});

type FormDataConfirm = {
  codeconfirm: string;
};

const ConfirmEmail: React.FC<{ changeEmail: () => void,data:any }> = ({
  changeEmail,
  data
}) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<FormDataConfirm>({
    resolver: yupResolver(schema),
  });
  const [timeLeft, setTimeLeft] = useState(data.time/1000-280);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {return;}

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const [loading,setLoading] = useState(false);
  const onSubmit = handleSubmit(({ codeconfirm }) => {
    if (codeconfirm.trim() === "") {
      setOpen(true);
    } else {
      setLoading(true);
      productAPI
        .confirmCode(codeconfirm,data._id)
        .then(() => {
          setLoading(false);
          toast.success("😋 confirm email success");
          history.push(ROUTERS.LOGIN);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("😭 Check code in email");
        });
    }
  });

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Alert severity="warning">Verification code required</Alert>
      </Snackbar>
      <form
        onSubmit={onSubmit}
        action=""
        className="login__form"
        style={{ backgroundColor: theme?.formBackGround }}
      >
        <h3 style={{ color: theme?.color }}>CONFIRM FORM</h3>
        <p style={{ color: theme?.color }}>Check your email</p>
        <p style={{color:"red",fontSize:".8rem"}}>Your time: {timeLeft}</p>
        <TextField
          inputRef={register}
          name="codeconfirm"
          label="Verification code"
          type="text"
          disabled={timeLeft===0}
        />
        <br />
        <div className="SignUpForm__button">
        <Button disabled={loading || timeLeft===0} type="submit" variant="contained" color="primary">
          Confirm
        </Button>
        {loading && <CircularProgress size={24} className="SignUpForm__process" />}
        </div>
        <div
          className="login__form--link"
          onClick={() => changeEmail()}
        >
          Change email
        </div>
      </form>
    </>
  );
};

export default ConfirmEmail;
