import socket from "@/configs/socket";
import { User } from "@/types/CurrentBoardPlay";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";
import React, { useEffect, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      textAlign: "center",
      margin: "auto",
    },
    btn: {
      color: "blue",
    },
  })
);
const Invite: React.FC<{
  state: boolean;
  onChange: any;
}> = ({ state, onChange }) => {
  const user: any = useContext(UserContext);
  const [users, setUsers] = React.useState<User[]>([]);
  const handleClose = () => {
    onChange(false);
  };
  const params: any = useParams();

  const classes = useStyles();
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (state) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [state]);

  useEffect(() => {
    socket.emit("waitingroom", (waitingroom: User[]) => {
      setUsers(waitingroom);
    });
  }, [state]);

  const handleInvite = (id: any, index: any) => {
    console.log("id", id);
    const btn: any = document.getElementById(`invite-btn-${index}`);
    btn.style.display = "none";
    socket.emit("invite", { id, invitor: user.user, roomId: params.id });
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={state}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Kỳ thủ đang ở sảnh chờ
        </DialogTitle>
        <List dense className={classes.root}>
          {users.map((user, index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;
            const btnId = `invite-btn-${index}`;
            return (
              <ListItem key={index} button>
                <ListItemAvatar>
                  <Avatar alt={`Avatar n°${index + 1}`} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={user.name} />
                <ListItemSecondaryAction
                  id={btnId}
                  onClick={(e) => handleInvite(user.id, index)}
                >
                  <IconButton
                    className={classes.btn}
                    edge="end"
                    aria-label="add"
                  >
                    <AddBoxIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        {/* <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </DialogContentText>
        </DialogContent> */}

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {/* <Button onClick={handleClose} color="primary">
            Subscribe
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invite;
