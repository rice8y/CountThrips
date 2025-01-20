import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable() {
  const [data, setData] = React.useState({ cnt1: 0, cnt2: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true); // Always set loading to true when fetching
    fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((json) => {
        const clientIP = json.ip;
        const apiUrl = "https://rice8y.pythonanywhere.com/api/result/";

        fetch(apiUrl, {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const latestData = data
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

            const result = latestData || { cnt1: 0, cnt2: 0 };
            setData(result);
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const rows = [
    { name: 'チャノキイロアザミウマ', value: data.cnt1 },
    { name: '別種アザミウマ', value: data.cnt2 },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>種別</TableCell>
            <TableCell>計測数</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
