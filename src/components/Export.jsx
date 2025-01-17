import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { saveAs } from "file-saver";
import { useCallback } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function CustomDataGrid() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [baseImageUrl, setBaseImageUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [date, setDate] = React.useState("");

  const cachedData = localStorage.getItem('apiData');

  React.useEffect(() => {
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setRows(parsedData);
      setLoading(false);
    } else {
      fetch("https://api64.ipify.org?format=json")
        .then((res) => res.json())
        .then((json) => {
          const clientIP = json.ip;
          // console.log("Client IP:", clientIP);
          const apiUrl = "https://rice8y.pythonanywhere.com/api/result/"
          const baseImageUrl = "https://rice8y.pythonanywhere.com/"

          setBaseImageUrl(baseImageUrl);

          fetch(apiUrl, {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const sortedData = data
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 7)
                .map((item, index) => ({
                  id: index + 1,
                  date: convertToJST(item.timestamp),
                  cnt1: item.cnt1,
                  cnt2: item.cnt2,
                  image: `${baseImageUrl}${item.image}`,
                }));

              localStorage.setItem('apiData', JSON.stringify(sortedData));

              setRows(sortedData);
              setLoading(false);
            })
            .catch((err) => {
              setError(err);
              setLoading(false);
            });
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, []);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const convertToJST = (dateString) => {
    return dayjs(dateString).tz('Asia/Tokyo').format('YYYY年M月D日');
  };

  const handleOpen = useCallback((url, date) => {
    setImageUrl(url);
    setDate(date);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    const imageName = imageUrl.split("/").pop();
    saveAs(imageUrl, imageName);
  };

  const columns = [
    { field: "date", headerName: "日付", width: 150 },
    { field: "cnt1", headerName: "チャノキイロアザミウマ", width: 250 },
    { field: "cnt2", headerName: "別種アザミウマ", width: 250 },
    {
      field: "image",
      headerName: "検出画像",
      width: 250,
      renderCell: (params) => (
        <Button
          onClick={() => handleOpen(params.value, params.row.date)}
        >
          Click here
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          検出画像
          <span style={{ fontSize: '0.8em', color: 'gray', float: 'right' }}>
            {date}
          </span>
        </DialogTitle>
        <DialogContent>
          <img src={imageUrl} alt="Image" style={{ width: "100%", height: "auto" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
          <Button onClick={handleDownload} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
