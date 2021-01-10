import React, { useEffect, useState } from "react";
import { callGetUserDetail } from "@/actions/GetUserDetail";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callGetUser } from "@/actions/GetUser";
import { callGetUserHistory } from "@/actions/GetUserHistory";
import {
  ColDef,
  DataGrid,
  ValueFormatterParams,
  ValueGetterParams,
} from "@material-ui/data-grid";
import clone from "clone";
import { Button, createStyles, makeStyles, Switch, Theme } from "@material-ui/core";
import "./style.scss"
import { callDisableUser } from "@/actions/DisableUser";

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

const UserDetail = () => {
  const classes = useStyles();
  const params: any = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const name = params.user;
  const [detail, setDetail] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const history = useHistory();
  useEffect(() => {
    dispatch(
      callGetUserDetail({
        id,
        cbSuccess: (data: any) => {
          setDetail(data[0]);
        },
        cbError: () => {
          console.log("Load user detail failed");
        },
      })
    );

    dispatch(
      callGetUserHistory({
        id,
        cbSuccess: (data: any) => {
          setHistoryList(data);
        },
        cbError: () => {
          console.log("Load user detail failed");
        },
      })
    );
  }, []);

  const detailClick = (id:any) => {
    const historyid = id;
    history.push(`/user/detail/history/${historyid}`);  
  }

  const columns: ColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomId", headerName: "Room", width: 250 },
    {
      field: "playerX.name",
      headerName: "Player ❌",
      width: 200,
      renderCell: (params: ValueGetterParams) => params.row.playerX.name,
    },
    {
      field: "playerO.name",
      headerName: "Player ⭕",
      width: 200,
      renderCell: (params: ValueGetterParams) => params.row.playerO.name,
    },
    {
      field: "winner",
      headerName: "Winner 👑",
      type: "number",
      width: 200,
    },
    {
      field: "seedetail",
      headerName: "Detail",
      width: 120,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <Button variant="contained"
          color="primary"
          size="small"
          onClick= {() => detailClick(params.row._id)}>
            Detail
          </Button>
        </strong>
      ),
    },
  ];


  const newData: any = clone(historyList);
  if (newData.length) {
    for (let i = 0; i < newData.length; i++) {
      newData[i].id = i;
    }
  }
  const user:any = clone(detail);
  if (user.length) {
    for (let i = 0; i < user.length; i++) {
      user[i].id = i;
    }
  }
  return (
    <div className="user">
      <div className="user__detail">
        <div className = "user__avatar" >
            <img className="avatar" src={user?.avatar} alt="" />
        </div>
      </div>
      <div className="user__history">
        <h3> USER HISTORY</h3>
        <div
          style={{
            height: 500,
            width: 1050,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <DataGrid
            rows={newData}
            columns={columns}
            pageSize={10}
            autoPageSize={true}
            loading={false}
            hideFooterSelectedRowCount={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
