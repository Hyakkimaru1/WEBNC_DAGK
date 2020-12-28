import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import socket from "@/configs/socket";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      textAlign: "center",
      margin: "auto",
    },
  })
);
const Invite: React.FC<{
  state: boolean;
  onChange: any;
}> = ({ state, onChange }) => {
  const [users, setUsers] = React.useState([]);
  const handleClose = () => {
    onChange(false);
  };
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


  }, []);
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
        <DialogTitle id="scroll-dialog-title">Kỳ thủ đang ở sảnh chờ</DialogTitle>
        <List dense className={classes.root}>
          {[0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem key={value} button>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="add">
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
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invite;
