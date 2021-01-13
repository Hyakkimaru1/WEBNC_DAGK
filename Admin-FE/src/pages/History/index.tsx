import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callGetUserHistory } from "@/actions/GetUserHistory";
import {
  ColDef,
  DataGrid,
  ValueFormatterParams,
  ValueGetterParams,
} from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import "./styles.scss";
import clone from 'clone';

const History = () => {
  const dispatch = useDispatch();
  const id = "";
  const [historyList, setHistoryList] = useState([]);
  const history = useHistory();
  const { isChanged } = useSelector((state:any) => state.GetUserHistory);
  useEffect(() => {
    dispatch(
      callGetUserHistory({
        id,
        cbSuccess: (data: any) => {
          const myData = clone(data);
          if (data.length>0) {
            for (let i = 0; i < data.length; i++) {
              myData[i].id = i;
            }
          }
          setHistoryList(myData);
        },
        cbError: () => {
          toast.error("Load history list failed");
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detailClick = (id: any) => {
    const historyid = id;
    history.push(`/history/${historyid}`);
  };

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
    <div className="historylist">
      <div>
        <h2 className="historylist__header">History list</h2>
      </div>
      <div
        style={{
          height: 500,
          width: "75%",
          minWidth:1050,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <DataGrid
          rows={historyList}
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
export default History;
