import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ROUTERS from '@/constants/routers';
import { useHistory } from 'react-router-dom';

const DialogLeave: React.FC<{ open: boolean; setOpen: any }> = ({
  open,
  setOpen,
}) => {
const history = useHistory();
  const handleClose = () => {
    setOpen(false);
  };

  const handleLeave = () => {
      history.push(ROUTERS.HOME);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có chắc muốn rời phòng không?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <span role="img" aria-label="emojis" >😭</span> Nếu rời đi bạn sẽ bị xét thua trận! <span role="img" aria-label="emojis" >😭</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Huỷ bỏ
          </Button>
          <Button onClick={handleLeave} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogLeave;
