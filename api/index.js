const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


function generateWeatherSVG(code) {
    const width = 500;
    const height = 500;
    let backgroundColor = '#A9A9A9';
    let elements = '';
    let weatherText = 'London';

    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    switch (true) {
        case (code === 0): 
            backgroundColor = isNight ? '#1a1a2e' : '#87CEEB';
            if (isNight) {
                elements += `<circle cx="${width * 0.7}" cy="${height * 0.3}" r="40" fill="#F5F5DC" />`;
                for(let i = 0; i < 20; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height * 0.5;
                    elements += `<circle cx="${x}" cy="${y}" r="2" fill="white" opacity="0.8" />`;
                }
                weatherText = "Clear Night in London";
            } else {
                elements += `<circle cx="${width * 0.5}" cy="${height * 0.4}" r="80" fill="#FFD700" />`;
                for(let i = 0; i < 8; i++) {
                    const angle = (i * 45) * Math.PI / 180;
                    const x1 = width * 0.5 + Math.cos(angle) * 100;
                    const y1 = height * 0.4 + Math.sin(angle) * 100;
                    const x2 = width * 0.5 + Math.cos(angle) * 130;
                    const y2 = height * 0.4 + Math.sin(angle) * 130;
                    elements += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="4" stroke-linecap="round" />`;
                }
                weatherText = "Sunny London";
            }
            break;
        
        case (code >= 71 && code <= 77): // Snow
            backgroundColor = '#E6E6FA';
            elements += `<circle cx="${width * 0.3}" cy="${height * 0.3}" r="60" fill="#D3D3D3" />`;
            elements += `<circle cx="${width * 0.5}" cy="${height * 0.35}" r="80" fill="#D3D3D3" />`;
            for(let i = 0; i < 50; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 3 + 1;
                elements += `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="0.8" />`;
            }
            weatherText = "Snowy London";
            break;
            
        case (code >= 95 && code <= 99): 
            backgroundColor = '#2F2F2F';
            elements += `<circle cx="${width * 0.3}" cy="${height * 0.2}" r="70" fill="#696969" />`;
            elements += `<circle cx="${width * 0.6}" cy="${height * 0.25}" r="80" fill="#696969" />`;
            elements += `<path d="M ${width * 0.4} ${height * 0.5} L ${width * 0.35} ${height * 0.65} L ${width * 0.45} ${height * 0.65} L ${width * 0.4} ${height * 0.8}" stroke="#FFFF00" stroke-width="8" fill="none" opacity="0.9" />`;
            for(let i = 0; i < 40; i++) {
                const x = Math.random() * width;
                const y = Math.random() * (height - height * 0.4) + height * 0.4;
                elements += `<line x1="${x}" y1="${y}" x2="${x + 3}" y2="${y + 20}" stroke="#4682B4" stroke-width="3" />`;
            }
            weatherText = "Stormy London";
            break;

        case (code >= 1 && code <= 3) || (code >= 45 && code <= 48): 
            backgroundColor = '#B0C4DE'; 
            elements += `<circle cx="${width * 0.7}" cy="${height * 0.35}" r="70" fill="#F0E68C" />`;
            elements += `<circle cx="${width * 0.3}" cy="${height * 0.4}" r="60" fill="white" opacity="0.9" />`;
            elements += `<circle cx="${width * 0.45}" cy="${height * 0.45}" r="80" fill="white" opacity="0.9" />`;
            elements += `<circle cx="${width * 0.6}" cy="${height * 0.4}" r="70" fill="white" opacity="0.9" />`;
            weatherText = "Cloudy London";
            break;

        case (code >= 51 && code <= 67) || (code >= 80 && code <= 82): 
            backgroundColor = '#778899'; 
            elements += `<circle cx="${width * 0.3}" cy="${height * 0.3}" r="60" fill="#B0C4DE" />`;
            elements += `<circle cx="${width * 0.45}" cy="${height * 0.35}" r="80" fill="#B0C4DE" />`;
            elements += `<circle cx="${width * 0.6}" cy="${height * 0.3}" r="70" fill="#B0C4DE" />`;
            for(let i = 0; i < 30; i++) {
                const x = Math.random() * width;
                const y = Math.random() * (height - height * 0.4) + height * 0.4;
                elements += `<line x1="${x}" y1="${y}" x2="${x + 5}" y2="${y + 15}" stroke="#4682B4" stroke-width="3" stroke-linecap="round" />`;
            }
            weatherText = "Rainy London";
            break;
        
        default:
            weatherText = `London (${code})`;
            break;
    }
    
    const gradients = `
        <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#FFFF99;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1" />
            </radialGradient>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${adjustColor(backgroundColor, -20)};stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    
    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="font-family: 'Arial', sans-serif;">
            ${gradients}
            <rect width="100%" height="100%" fill="url(#skyGradient)" />
            ${elements}
            <text x="50%" y="85%" font-size="32" fill="white" text-anchor="middle" 
                  style="paint-order: stroke; stroke: #333; stroke-width: 3px; font-weight: bold;">
                ${weatherText}
            </text>
            <text x="50%" y="95%" font-size="16" fill="white" text-anchor="middle" opacity="0.8"
                  style="paint-order: stroke; stroke: #333; stroke-width: 1px;">
                ${new Date().toLocaleString()}
            </text>
        </svg>
    `;
}

function adjustColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function addAnimations(weatherCode) {
    let animations = '';
    
    if (weatherCode >= 51 && weatherCode <= 67) { // Rain
        animations = `
            <style>
                .rain { animation: fall 1s linear infinite; }
                @keyframes fall {
                    0% { transform: translateY(-10px); opacity: 1; }
                    100% { transform: translateY(20px); opacity: 0.3; }
                }
            </style>
        `;
    } else if (weatherCode >= 71 && weatherCode <= 77) { // Snow
        animations = `
            <style>
                .snow { animation: snowfall 3s ease-in-out infinite; }
                @keyframes snowfall {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(10px) rotate(180deg); }
                }
            </style>
        `;
    }
    
    return animations;
}

app.get('/api', (req, res) => {
    const weatherQuery = req.query.weather || '999';
    let weatherCode = parseInt(weatherQuery, 10) || 999;
    
    const svgImage = generateWeatherSVG(weatherCode);
    const base64Image = Buffer.from(svgImage).toString('base64');
    const imageDataURI = `data:image/svg+xml;base64,${base64Image}`;

    // Daha zengin metadata
    const weatherInfo = getWeatherInfo(weatherCode);
    const currentTime = new Date();
    const timeOfDay = getTimeOfDay(currentTime.getHours());
    
    const metadata = {
        name: `London Weather NFT #${weatherCode}`,
        description: `An on-chain, dynamic representation of London's weather. Currently showing ${weatherInfo.description}. This NFT updates every 5 minutes via Kwala automation, making each moment unique and collectible.`,
        image: imageDataURI,
        animation_url: imageDataURI,
        external_url: "https://weather-morph.vercel.app",
        background_color: weatherInfo.bgColor.replace('#', ''),
        attributes: [
            { "trait_type": "Weather Condition", "value": weatherInfo.condition },
            { "trait_type": "WMO Code", "value": weatherCode },
            { "trait_type": "Time of Day", "value": timeOfDay },
            { "trait_type": "Season", "value": getSeason() },
            { "trait_type": "Rarity", "value": getWeatherRarity(weatherCode) },
            { "trait_type": "Last Updated", "value": currentTime.toISOString() },
            { "trait_type": "Temperature Range", "value": weatherInfo.tempRange },
            { "trait_type": "Visibility", "value": weatherInfo.visibility }
        ]
    };

    res.json(metadata);
});

function getWeatherInfo(code) {
    const weatherMap = {
        0: { condition: "Clear Sky", description: "perfect clear skies", bgColor: "#87CEEB", tempRange: "Mild", visibility: "Excellent" },
        1: { condition: "Mainly Clear", description: "mostly clear with few clouds", bgColor: "#B0C4DE", tempRange: "Mild", visibility: "Good" },
        61: { condition: "Light Rain", description: "light rainfall", bgColor: "#778899", tempRange: "Cool", visibility: "Moderate" },
        // ... daha fazla mapping
    };
    
    return weatherMap[code] || { 
        condition: "Unknown", 
        description: "unknown weather pattern", 
        bgColor: "#A9A9A9",
        tempRange: "Variable",
        visibility: "Unknown"
    };
}

function getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Autumn";
    return "Winter";
}

function getWeatherRarity(code) {
    if ([95, 96, 97, 98, 99].includes(code)) return "Legendary"; // Thunderstorm
    if ([71, 72, 73, 74, 75, 76, 77].includes(code)) return "Epic"; // Snow
    if ([61, 62, 63, 64, 65, 66, 67].includes(code)) return "Rare"; // Rain
    if ([1, 2, 3].includes(code)) return "Common"; // Cloudy
    if (code === 0) return "Uncommon"; // Clear
    return "Unknown";
}

function getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
