import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import ExportIcon from "@mui/icons-material/SaveAlt";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export default function BasicLineChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            const sortedData = data
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 7)
              .map((item) => ({
                ...item,
                timestamp: convertToJST(item.timestamp),
              }));
            setData(sortedData.reverse());
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

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const convertToJST = (dateString) => {
    return dayjs(dateString).tz('Asia/Tokyo').format('YYYY年M月D日');
  };

  const exportChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const timestamp = `${year}-${month}-${day}`;
        const link = document.createElement("a");
        link.download = `line_chart_${timestamp}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const chartData = {
    xAxis: [
      {
        data: data.map((item) => item.timestamp),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: data.map((item) => item.cnt1),
        label: "チャノキイロアザミウマ",
      },
      {
        data: data.map((item) => item.cnt2),
        label: "別種アザミウマ",
      },
    ],
  };

  const aspectRatio = 700 / 400;
  const chartWidth = Math.min(dimensions.width * 0.95, 1000);
  const chartHeight = chartWidth / aspectRatio;

  return (
    <div>
      <div ref={chartRef}>
        <LineChart
          xAxis={chartData.xAxis}
          series={chartData.series}
          width={chartWidth}
          height={chartHeight}
        />
      </div>
      <Button
        startIcon={<ExportIcon />}
        variant="contained"
        color="primary"
        onClick={exportChart}
      >
        Export
      </Button>
    </div>
  );
}
