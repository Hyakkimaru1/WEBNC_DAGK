import { callGetUser } from "@/actions/GetUser";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";

// Material UI
import {
  DataGrid,
  ColDef,
  ValueGetterParams,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import { Button, Switch } from "@material-ui/core";
import { callDisableUser } from "@/actions/DisableUser";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import clone from 'clone';
import socket from '@/configs/socket';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

const User = () => {
  const classes = useStyles();
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [typeValue, setTypeValue] = useState("");
  const [click, setClick] = useState(false);
  const { isChanged } = useSelector((state: any) => state.GetUser);
  const token = localStorage.getItem("token");
  useEffect(() => {
    dispatch(
      callGetUser({
        typeValue,
        cbSuccess: (data: any) => {
          const myData = clone(data);
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              myData[i]["id"] = i;
            }
          }
          setUserList(myData);
        },
        cbError: (err:any) => {
          toast.error("Load user list failed");
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeValue, click]);

  function handleChange(e: any) {
    setTypeValue(e.target.value);
  }

  const disableUser = (user: any, isActive: boolean) => {
    setClick(!click);
    const username = user;
    const status = isActive;
    dispatch(
      callDisableUser({
        username,
        status,
        cbSuccess: (data: any) => {
          if (isActive)
          {
            socket.emit("ban-user",user,token);
          }
          toast.success(" Modify user completed! 💡");
        },
        cbError: () => {
          toast.info("Action failed! Try again.");
        },
      })
    );
  };
  
  const detailClick = (id: any) => {
    history.push(`/user/${id}`);
  };

  const columns: ColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "Username ",
      width: 200,
    },
    {
      field: "name",
      headerName: "Name 👤",
      width: 150,
    },
    { field: "joinDate", headerName: "Join Date 📆", width: 150 },
    {
      field: "wins",
      headerName: "Wins 👑",
      type: "number",
      width: 120,
    },
    {
      field: "cups",
      headerName: "️Cups ️🏆",
      type: "number",
      width: 120,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params: ValueGetterParams) => (
        <strong>
          <Switch
            checked={params.row.isActive}
            onClick={() => disableUser(params.row.user, params.row.isActive)}
            name="isActive"
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </strong>
      ),
    },
    {
      field: "matches",
      headerName: "Matches",
      width: 120,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => detailClick(params.row._id)}
          >
            Detail
          </Button>
        </strong>
      ),
    },
  ];

  return (
    <div className="user">
      <h3 className="user__header"> USER LIST</h3>
      <div className="user__search">
        <Paper component="form" className={classes.root}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Type to search"
            inputProps={{ "aria-label": "search google maps" }}
            value={typeValue}
            onChange={handleChange}
            onClick={handleChange}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton
            color="primary"
            className={classes.iconButton}
            aria-label="directions"
          >
            <DirectionsIcon />
          </IconButton>
        </Paper>
      </div>
      <div
        style={{
          height: 500,
          width: "70%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <DataGrid
          rows={userList}
          columns={columns}
          pageSize={10}
          autoPageSize={true}
          loading={isChanged}
          hideFooterSelectedRowCount={true}
        />
      </div>
    </div>
  );
};
export default User;
