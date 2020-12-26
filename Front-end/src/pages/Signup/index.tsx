import React, { useState } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import SignupForm from "./SignupForm/index";
import ConfirmEmail from "./ConfirmEmail/index";

const Signup: React.FC = () => {
  const [stepConfirm, setStepConfirm] = useState(false);
  const [data,setData] = useState({_id:"",time:""});
  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      {!stepConfirm ? (
        <SignupForm handleConfirm={(data:any) => {
          setData(data);
          setStepConfirm(true)
        }} />
      ) : (
        <ConfirmEmail data={data} changeEmail={() => setStepConfirm(false)} />
      )}
    </div>
  );
};

export default Signup;
