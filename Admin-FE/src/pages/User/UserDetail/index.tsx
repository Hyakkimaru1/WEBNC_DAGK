import React, { useEffect, useState } from "react";
import { callGetUserDetail } from "@/actions/GetUserDetail";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callGetUserHistory } from "@/actions/GetUserHistory";
import {
  ColDef,
  DataGrid,
  ValueFormatterParams,
  ValueGetterParams,
} from "@material-ui/data-grid";
import clone from "clone";
import { Button } from "@material-ui/core";
import "./style.scss";
import { toast } from "react-toastify";
import ROUTERS from '@/constants/routers/index';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const UserDetail = () => {
  const params: any = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const [detail, setDetail] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const {isChanged} = useSelector((state:any) => state.GetUserHistory);
  const history = useHistory();
  useEffect(() => {
    dispatch(
      callGetUserDetail({
        id,
        cbSuccess: (data: any) => {
          setDetail(data[0]);
        },
        cbError: () => {
          toast.error("Load user detail failed!");
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
          toast.error("Load user detail failed!");
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detailClick = (id:any) => {
    const historyid = id;
    history.push(`/history/${historyid}`);  
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
      <Button onClick={()=>history.push(ROUTERS.HOME)} className="button-back">
        <ArrowBackIcon/>
      </Button>
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
            loading={isChanged}
            hideFooterSelectedRowCount={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
