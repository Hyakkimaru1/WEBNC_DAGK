import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import socket from "@/configs/socket";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      margin: "auto",
    },
    btn: {
      color: "blue",
    },
  })
);
const QuickJoinDialog: React.FC<{
  state: boolean;
  onChange: any;
}> = ({ state, onChange }) => {
  const classes = useStyles();
  const token = localStorage.getItem("token");

  const handleClose = () => {
    socket.emit("quickJoinCancel", token);
    onChange(false);
  };

  return (
    <div>
      <Dialog
        open={state}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Waiting for others player!"}
        </DialogTitle>
        <DialogContent className={classes.root}>
          <CircularProgress color="secondary" />
        </DialogContent>
        <DialogActions className={classes.root}>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuickJoinDialog;
