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
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { toast } from "react-toastify";
import "./styles.scss";

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

const History = () => {
  const classes = useStyles();
  const params: any = useParams();
  const dispatch = useDispatch();
  const id = "";
  const name = params.user;
  const [detail, setDetail] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const history = useHistory();
  useEffect(() => {
    dispatch(
      callGetUserHistory({
        id,
        cbSuccess: (data: any) => {
          setHistoryList(data);
        },
        cbError: () => {
          toast.error("Load history list failed");
        },
      })
    );
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
      headerName: "Chat",
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
  const isLoading = (newData.length)? false : true;
  return (
    <div className = "historylist"> 
     <div>
     <h2 className="historylist__header">
            History list
        </h2>
     </div>
     <div
          style={{
            height: 500,
            width: "75%",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <DataGrid
            rows={newData}
            columns={columns}
            pageSize={10}
            autoPageSize={true}
            loading={isLoading}
            hideFooterSelectedRowCount={true}
          />
        </div>
  
    </div>
  )
};
export default History;
