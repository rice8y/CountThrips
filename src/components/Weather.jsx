import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    const lat = 33.8817233746384;
    const lon = 132.80385277259467;
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CountThrips',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const timeseries = weatherData?.properties?.timeseries ?? [];
  const currentWeather = timeseries[0];
  const groupedData = timeseries.reduce((acc, entry) => {
    const date = dayjs(entry.time).format('YYYY-MM-DD');
    const time = dayjs(entry.time).format('HH:mm');
    
    if (time === '09:00') {
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
    }
  
    return acc;
  }, {});

  const dailyData = Object.entries(groupedData).slice(1, 8);

  const convertToJST = (dateString) => {
    return dayjs(dateString).tz('Asia/Tokyo').format('M月D日 H:mm');
  };

  const weatherDictionary = {
    clearsky: "快晴",
    fair: "晴れ",
    partlycloudy: "部分的に曇り",
    cloudy: "曇り",
    lightrainshowers: "小雨のにわか雨",
    rainshowers: "にわか雨",
    heavyrainshowers: "強いにわか雨",
    lightrainshowersandthunder: "小雨のにわか雨と雷",
    rainshowersandthunder: "にわか雨と雷",
    heavyrainshowersandthunder: "強いにわか雨と雷",
    lightsleetshowers: "小さなみぞれのにわか雨",
    sleetshowers: "みぞれのにわか雨",
    heavysleetshowers: "強いみぞれのにわか雨",
    lightssleetshowersandthunder: "小さなみぞれのにわか雨と雷",
    sleetshowersandthunder: "みぞれのにわか雨と雷",
    heavysleetshowersandthunder: "強いみぞれのにわか雨と雷",
    lightsnowshowers: "小さな雪のにわか雨",
    snowshowers: "雪のにわか雨",
    heavysnowshowers: "強い雪のにわか雨",
    lightssnowshowersandthunder: "小さな雪のにわか雨と雷",
    snowshowersandthunder: "雪のにわか雨と雷",
    heavysnowshowersandthunder: "強い雪のにわか雨と雷",
    lightrain: "小雨",
    rain: "雨",
    heavyrain: "強い雨",
    lightrainandthunder: "小雨と雷",
    rainandthunder: "雨と雷",
    heavyrainandthunder: "強い雨と雷",
    lightsleet: "小さなみぞれ",
    sleet: "みぞれ",
    heavysleet: "強いみぞれ",
    lightsleetandthunder: "小さなみぞれと雷",
    sleetandthunder: "みぞれと雷",
    heavysleetandthunder: "強いみぞれと雷",
    lightsnow: "小さな雪",
    snow: "雪",
    heavysnow: "強い雪",
    lightsnowandthunder: "小さな雪と雷",
    snowandthunder: "雪と雷",
    heavysnowandthunder: "強い雪と雷",
    fog: "霧",
  };

  const getJapaneseWeather = (symbolCode) => {
    if (!symbolCode) return "不明";
    const baseSymbol = symbolCode.split("_")[0];
    return weatherDictionary[baseSymbol] || "不明";
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 7,
    },
    largeSuperDesktop: {
      breakpoint: { max: 1600, min: 1400 },
      items: 6,
    },
    mediumSuperDesktop: {
      breakpoint: { max: 1400, min: 1200 },
      items: 5,
    },
    largeDesktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const getWindDirection = (degree) => {
    const directions = [
      "北",
      "北東",
      "東",
      "南東",
      "南",
      "南西",
      "西",
      "北西"
    ];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const currentDetails = currentWeather?.data?.instant?.details || {};
  const currentSymbolCode = currentWeather?.data?.next_1_hours?.summary?.symbol_code;

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <div>
        <Typography variant="h4" gutterBottom>
          愛媛県農林水産研究所・果樹研究センターの気象情報
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            marginBottom: 3,
            gap: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <img
            src={`/wicons/svg/${currentSymbolCode}.svg`}
            alt={currentSymbolCode}
            style={{ width: '120px', height: '120px' }}
          />
          <Box>
            <Typography sx={{ textAlign: 'left' }} variant="h4">{convertToJST(currentWeather.time)}</Typography>
            <Typography sx={{ textAlign: 'left' }} variant="h5">
              現在の天気: {getJapaneseWeather(currentSymbolCode)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box sx={{ marginLeft: 'auto', textAlign: 'left', marginRight: 2 }}>
              <Typography>気温: {currentDetails.air_temperature}°C</Typography>
              <Typography>湿度: {currentDetails.relative_humidity}%</Typography>
              <Typography>降水量: {currentWeather?.data?.next_1_hours?.details?.precipitation_amount || 0} mm</Typography>
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography>風速: {currentDetails.wind_speed} m/s</Typography>
              <Typography>風向: {getWindDirection(currentDetails.wind_from_direction)}</Typography>
              <Typography>雲量: {currentDetails.cloud_area_fraction}%</Typography>
            </Box>
          </Box>
        </Box>
      </div>

      <Carousel responsive={responsive}>
        {dailyData.map(([date, entries]) => {
          const dayDetails = entries[0].data.instant.details;
          const symbolCode = entries[0].data.next_6_hours?.summary?.symbol_code;

          return (
            <Card key={date} style={{ border: 'none', boxShadow: 'none', margin: '0 5px', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">{dayjs(date).format('M月D日')}</Typography>
                <img
                  src={`/wicons/svg/${symbolCode}.svg`}
                  alt={symbolCode}
                  style={{ width: '60px', height: '60px' }}
                />
                <Typography>天気: {getJapaneseWeather(symbolCode)} {console.log(symbolCode)}</Typography>
                <Typography>気温: {dayDetails.air_temperature}°C</Typography>
                <Typography>湿度: {dayDetails.relative_humidity}%</Typography>
                <Typography>
                  降水量: {entries[0]?.data?.next_6_hours?.details?.precipitation_amount || 0} mm
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Carousel>
    </Box>
  );
};

export default Weather;
