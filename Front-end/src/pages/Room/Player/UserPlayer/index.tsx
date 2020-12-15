import React from "react";
import "./style.scss";
import { Card, CardContent, Typography, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
  username: string | null;
  avt?: string;
  playKey?: number;
  onClick: () => void;
}> = ({ username, avt = "", playKey = 1, onClick}) => {
  const classes = useStyles();

  if (username) {
    return (
      <div>
        <Card className={classes.root}>
          <CardContent>
            <div></div>
            <Typography variant="h5" component="h2">
              <Avatar className={classes.avatar} src={avt} />
            </Typography>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {username}
            </Typography>
            <div style={{ position: "relative", marginTop: "1rem" }}>
              {playKey ===1 ? (
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
    <div style={{cursor:'pointer'}} onClick={() => onClick()}>
      <Card className={classes.root}>
        <CardContent>Join here</CardContent>
      </Card>
    </div>
  );
};

export default UserPlayer;
