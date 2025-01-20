import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  const [data, setData] = React.useState([]);
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

            const result = latestData ? [latestData.cnt1, latestData.cnt2] : [0, 0];
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

  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: data[0], label: 'チャノキイロアザミウマ' },
            { id: 1, value: data[1], label: '別種アザミウマ' },
          ],
        },
      ]}
      width={400}
      height={200}
      margin={{ right: 240 }}
    />
  );
}
