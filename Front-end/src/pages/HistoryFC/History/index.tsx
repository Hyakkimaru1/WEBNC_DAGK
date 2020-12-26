import React from "react";
import {
  DataGrid,
  ColDef,
  PageChangeParams,
  ValueGetterParams,
  RowSelectedParams,
} from "@material-ui/data-grid";
import clone from "clone";
import "./style.scss";
import { useSelector } from 'react-redux';

const columns: ColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "opponent",
    headerName: "Opponent",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 200,
    valueGetter: (params: ValueGetterParams) => {
      if (params.row.playerO !== params.row.user) {
        return params.row.playerO;
      }
      return params.row.playerX;
    },
  },
  { field: "winner", headerName: "Winner", width: 200 },
  {
    field: "_id",
    headerName: "Board ID",
    type: "string",
    width: 250,
  },
];

const History: React.FC<{
  data: any;
  user: any;
  handleSelected: (id: any) => void;
}> = ({ data, user, handleSelected }) => {
  const { isLoading } = useSelector((state:any) => state.HistoryUserSlide);

  const newData = clone(data);
  if (newData.length) {
    for (let i = 0; i < newData.length; i++) {
      newData[i].id = i;
      newData[i].user = user.user;
      delete newData[i].board;
    }
  }
  const handlePageChange = (param: PageChangeParams) => {
    //console.log(param);
  };
  const handleSelect = (param: RowSelectedParams) => {
    handleSelected(param.data.id);
  };
  return (
    <div style={{ height: 350, width: "60%", margin: "0 auto" }}>
      <DataGrid
        rows={newData}
        onPageChange={handlePageChange}
        columns={columns}
        pageSize={5}
        loading={isLoading}
        onRowSelected={handleSelect}
      />
    </div>
  );
};
export default History;
