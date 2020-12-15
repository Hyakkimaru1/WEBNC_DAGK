import React from "react";
import "./style.scss";
import { Card, CardContent, Typography, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  root: {
    minWidth: 250,
    textAlign: "center",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  avatar:{
    margin:'0 auto'
  }
});
const UserPlayer: React.FC<{ username?: string; avt?: string }> = ({
  username = "Duy",
  avt,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {username}
          </Typography>
          <Typography  variant="h5" component="h2">
            <Avatar className={classes.avatar}/>
          </Typography>
          <Typography variant="body2" component="p">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPlayer;
