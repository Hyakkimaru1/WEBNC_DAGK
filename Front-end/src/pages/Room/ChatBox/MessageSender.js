import { Avatar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideocamIcon from "@material-ui/icons/Videocam";
import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import "./MessageSender.css";
import "./popup.css";
import PublicIcon from "@material-ui/icons/Public";

function MessageSender() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    setInput("");
  };

  const handleSubmitPost = (e) => {
    if (input.trim() === "") {
      return;
    }
    db.collection("posts").add({
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      profilePic: user.photoURL,
      username: user.displayName,
      image: image,
    });
    document.getElementById("popup").style.transform = "scale(0)";
    document.getElementsByTagName("BODY")[0].style.overflow = "auto";
    document.getElementById("popupImg__value").value = "";
    setInput("");
    setImage("");
  };

  const handleSubmitPost2 = (e) => {
    db.collection("stories").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      profileSrc: user.photoURL,
      title: user.displayName,
      image: image2,
    });
    document.getElementById("popup2").style.transform = "scale(0)";
    document.getElementsByTagName("BODY")[0].style.overflow = "auto";
    document.getElementById("popupImg__value2").value = "";
    setImage2("");
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [input]);

  return (
    <div className="messageSender">
      <div className="messageSender__top">
        <Avatar src={user.photoURL} />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`What's on your mind, ${user.displayName}?`}
            type="text"
          />
          <button onClick={handleSubmit} type="submit"></button>
        </form>
      </div>
      <div className="messageSender__bottom">
        <div className="messageSender__option">
          <VideocamIcon style={{ color: "red" }} />
          <h4>Live Video</h4>
        </div>
        <div
          className="messageSender__option"
          onClick={() => {
            document.getElementById("popup").style.transform = "scale(1)";
            document.getElementsByTagName("BODY")[0].style.overflow = "hidden";
          }}
        >
          <PhotoLibraryIcon style={{ color: "green" }} />
          <h4>Photo/Video</h4>
        </div>
        <div className="messageSender__option">
          <InsertEmotionIcon style={{ color: "orange" }} />
          <h4>Felling/Action</h4>
        </div>
      </div>
      <div id="popup" className="popup">
        <div className="popup__bg"></div>
        <div className="popup__show">
          <div className="popup__header">
            <p className="popup__header--name">Create post</p>
            <div className="popup__header--button">
              <CloseIcon
                onClick={() => {
                  document.getElementById("popup").style.transform = "scale(0)";
                  document.getElementsByTagName("BODY")[0].style.overflow =
                    "auto";
                  document.getElementById("popupImg__value").value = "";
                }}
              />
            </div>
          </div>
          <div className="popup__body">
            <div className="popup__body--name">
              <Avatar src={user.photoURL} />
              <div className="popup__name">
                <p>{user.displayName}</p>
                <div className="popup__icon">
                  <PublicIcon style={{ fontSize: ".8rem" }} />
                  <p style={{ paddingBottom: ".3rem", paddingLeft: ".3rem" }}>
                    public
                  </p>
                </div>
              </div>
            </div>
            <div className="popup__body--img">
              <textarea
                type="text"
                ref={textareaRef}
                value={input}
                placeholder={`What's on your mind, ${user.displayName}?`}
                onChange={(e) => setInput(e.target.value)}
              />
              <img id="popupImage" width="480" src={image} alt="" />
            </div>
            <div className="popup__body--input">
              <CropOriginalIcon />{" "}
              <input
                id="popupImg__value"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                type="text"
                placeholder="Put your url image here!"
              />
            </div>
          </div>
          <div className="popup__bottom">
            <div onClick={handleSubmitPost} className="popup__bottom--button">
              Post
            </div>
          </div>
        </div>
      </div>

      <div id="popup2" className="popup">
        <div className="popup__bg"></div>
        <div className="popup__show">
          <div className="popup__header">
            <p className="popup__header--name">Create a story</p>
            <div className="popup__header--button">
              <CloseIcon
                onClick={() => {
                  document.getElementById("popup2").style.transform =
                    "scale(0)";
                  document.getElementsByTagName("BODY")[0].style.overflow =
                    "auto";
                  document.getElementById("popupImg__value2").value = "";
                }}
              />
            </div>
          </div>
          <div className="popup__body">
            <div className="popup__body--name">
              <Avatar src={user.photoURL} />
              <div className="popup__name">
                <p>{user.displayName}</p>
                <div className="popup__icon">
                  <PublicIcon style={{ fontSize: ".8rem" }} />
                  <p style={{ paddingBottom: ".3rem", paddingLeft: ".3rem" }}>
                    public
                  </p>
                </div>
              </div>
            </div>
            <div className="popup__body--img">
              <img width="480" src={image2} alt="" />
            </div>
            <div className="popup__body--input">
              <CropOriginalIcon />{" "}
              <input
                id="popupImg__value2"
                onChange={(e) => {
                  setImage2(e.target.value);
                }}
                type="text"
                placeholder="Put your url image here!"
              />
            </div>
          </div>
          <div className="popup__bottom">
            <div onClick={handleSubmitPost2} className="popup__bottom--button">
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageSender;
