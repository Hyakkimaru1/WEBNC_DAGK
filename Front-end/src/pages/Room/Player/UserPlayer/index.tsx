import React, { useContext } from "react";
import "./style.scss";
import { Card, CardContent, Typography, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckRankUser from "@/Function/CheckRankUser";
import EmojiEventsTwoToneIcon from "@material-ui/icons/EmojiEventsTwoTone";
import BrushIcon from "@material-ui/icons/Brush";
import { ThemeContext } from "@/contexts/ThemeContext";
import USERPLAY from "@/types/UserPlay";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    textAlign: "center",
    position: "relative",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  avatar: {
    margin: "0 auto",
  },
});

const UserPlayer: React.FC<{
  user?: USERPLAY;
  playKey?: number;
  turn: number | null;
  isReady?: boolean;
  time: number;
  onClick: () => void;
}> = ({ user, playKey = 1, onClick,time }) => {
  const classes = useStyles();
  const { theme } = useContext(ThemeContext);
  if (user) {
    return (
      <div>
        <Card className={classes.root}>
          <CardContent>
            <div className="userplayer-wrapper">
              <div className="userplayer__rank">
                <p className="userplayer__rank--cup">{CheckRankUser(user.cups)}</p>
              </div>
              <div>
                <Typography variant="h5" component="h2">
                  <Avatar className={classes.avatar} src={user.avatar} />
                </Typography>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {user.name}
                </Typography>
              </div>
              <div className="userplayer__cup">
                <a
                  className="userplayer__cup--cups"
                  href="/aaa"
                  style={{ color: theme?.color }}
                  onClick={(e) => e.preventDefault()}
                  title="User's Cups"
                >
                  {" "}
                  <EmojiEventsTwoToneIcon
                    style={{ color: "#f9ca24", fontSize: "1rem" }}
                  />
                  {"  "}&nbsp;
                  {user.cups}{" "}
                </a>
                <a
                  className="userplayer__cup--cups"
                  href="/aaa"
                  style={{ color: theme?.color }}
                  onClick={(e) => e.preventDefault()}
                  title="Win"
                >
                  <BrushIcon style={{ color: "#eb4d4b", fontSize: "1rem" }} />{" "}
                  &nbsp;
                  {user.wins}{" "}
                </a>
              </div>
            </div>

            <div style={{ position: "relative", marginTop: "1rem" }}>
              <div className="userplayer__countdown">
                {" "}
                {moment.utc(time * 1000).format("mm:ss")}{" "}
              </div>
              {playKey === 1 ? (
                <div className="square__X"></div>
              ) : (
                <div className="square__O"></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div style={{ cursor: "pointer" }} onClick={() => onClick()}>
      <Card className={classes.root}>
        <CardContent>Join here</CardContent>
      </Card>
    </div>
  );
};

export default UserPlayer;
