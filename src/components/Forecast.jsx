import React, { useState, useEffect } from 'react';

const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    const url = `https://weather.tsukumijima.net/api/forecast/city/380010`;
    
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
      setForecastData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const location = forecastData?.properties?.location ?? [];

  return (
    <div>
      <p>Description: {forecastData.description.bodyText}</p>
      <p>Location: {forecastData.location.city}</p>
      <p>Prefecture: {forecastData.location.prefecture}</p>
      {/* <img src={`${forecastData.forecasts.image.url}`} /> */}
    </div>
  );  
};

export default Forecast;


// ❯ curl https://weather.tsukumijima.net/api/forecast/city/380010
// {
//     "publicTime": "2025-01-14T17:00:00+09:00",
//     "publicTimeFormatted": "2025/01/14 17:00:00",
//     "publishingOffice": "松山地方気象台",
//     "title": "愛媛県 松山 の天気",
//     "link": "https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=380000",
//     "description": {
//         "publicTime": "2025-01-14T16:32:00+09:00",
//         "publicTimeFormatted": "2025/01/14 16:32:00",
//         "headlineText": "",
//         "bodyText": "　愛媛県は、気圧の谷や湿った空気の影響で概ね曇っています。\n\n　１４日は、気圧の谷や湿った空気の影響で曇り、夜遅くは雨の降る所があるでし
// ょう。\n\n　１５日は、気圧の谷や湿った空気の影響で曇り、朝まで雨や雪が降る見込みです。",
//         "text": "　愛媛県は、気圧の谷や湿った空気の影響で概ね曇っています。\n\n　１４日は、気圧の谷や湿った空気の影響で曇り、夜遅くは雨の降る所があるでしょう
// 。\n\n　１５日は、気圧の谷や湿った空気の影響で曇り、朝まで雨や雪が降る見込みです。"
//     },
//     "forecasts": [
//         {
//             "date": "2025-01-14",
//             "dateLabel": "今日",
//             "telop": "曇り",
//             "detail": {
//                 "weather": "くもり　所により　夜遅く　雨",
//                 "wind": "南西の風　海上　では　南西の風　やや強く",
//                 "wave": "０．５メートル　後　１メートル"
//             },
//             "temperature": {
//                 "min": {
//                     "celsius": null,
//                     "fahrenheit": null
//                 },
//                 "max": {
//                     "celsius": null,
//                     "fahrenheit": null
//                 }
//             },
//             "chanceOfRain": {
//                 "T00_06": "--%",
//                 "T06_12": "--%",
//                 "T12_18": "--%",
//                 "T18_24": "20%"
//             },
//             "image": {
//                 "title": "曇り",
//                 "url": "https://www.jma.go.jp/bosai/forecast/img/200.svg",
//                 "width": 80,
//                 "height": 60
//             }
//         },
//         {
//             "date": "2025-01-15",
//             "dateLabel": "明日",
//             "telop": "雨のち曇",
//             "detail": {
//                 "weather": "雨　昼前　から　くもり",
//                 "wind": "北西の風　やや強く",
//                 "wave": "１メートル"
//             },
//             "temperature": {
//                 "min": {
//                     "celsius": "6",
//                     "fahrenheit": "42.8"
//                 },
//                 "max": {
//                     "celsius": "9",
//                     "fahrenheit": "48.2"
//                 }
//             },
//             "chanceOfRain": {
//                 "T00_06": "80%",
//                 "T06_12": "50%",
//                 "T12_18": "10%",
//                 "T18_24": "10%"
//             },
//             "image": {
//                 "title": "雨のち曇",
//                 "url": "https://www.jma.go.jp/bosai/forecast/img/313.svg",
//                 "width": 80,
//                 "height": 60
//             }
//         },
//         {
//             "date": "2025-01-16",
//             "dateLabel": "明後日",
//             "telop": "曇時々晴",
//             "detail": {
//                 "weather": "くもり　時々　晴れ",
//                 "wind": "北西の風　後　西の風",
//                 "wave": "１メートル"
//             },
//             "temperature": {
//                 "min": {
//                     "celsius": "2",
//                     "fahrenheit": "35.6"
//                 },
//                 "max": {
//                     "celsius": "8",
//                     "fahrenheit": "46.4"
//                 }
//             },
//             "chanceOfRain": {
//                 "T00_06": "20%",
//                 "T06_12": "20%",
//                 "T12_18": "20%",
//                 "T18_24": "20%"
//             },
//             "image": {
//                 "title": "曇時々晴",
//                 "url": "https://www.jma.go.jp/bosai/forecast/img/201.svg",
//                 "width": 80,
//                 "height": 60
//             }
//         }
//     ],
//     "location": {
//         "area": "四国",
//         "prefecture": "愛媛県",
//         "district": "中予",
//         "city": "松山"
//     },
//     "copyright": {
//         "title": "(C) 天気予報 API（livedoor 天気互換）",
//         "link": "https://weather.tsukumijima.net/",
//         "image": {
//             "title": "天気予報 API（livedoor 天気互換）",
//             "link": "https://weather.tsukumijima.net/",
//             "url": "https://weather.tsukumijima.net/logo.png",
//             "width": 120,
//             "height": 120
//         },
//         "provider": [
//             {
//                 "link": "https://www.jma.go.jp/jma/",
//                 "name": "気象庁 Japan Meteorological Agency",
//                 "note": "気象庁 HP にて配信されている天気予報を JSON データへ編集しています。"
//             }
//         ]
//     }
// }