import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: "0 auto",
  },
  media: {
    height: 140,
  },
});

export default function CardUser({ user }: { user: any }) {
  const classes = useStyles();
  const { theme } = useContext(ThemeContext);
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          style={{
            background: theme?.BackgrounImg,
            backgroundBlendMode: theme?.backgroundBlendMode,
            display: "grid",
            placeItems: "center",
          }}
          className={classes.media}
          title="Contemplative Reptile"
        >
          <Avatar style={{ height: '70px', width: '70px' }}/>
        </CardMedia>
        <CardContent style={{ textAlign: "center" }}>
          Hi {user.user}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
