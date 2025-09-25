const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


function generateWeatherSVG(code) {
    const width = 500;
    const height = 500;
    let backgroundColor = '#A9A9A9'; // Koyu gri (varsayılan)
    let elements = '';
    let weatherText = 'London';


    switch (true) {
        case (code === 0): // Clear sky
            backgroundColor = '#87CEEB';
            elements = `<circle cx="${width * 0.5}" cy="${height * 0.4}" r="80" fill="#FFD700" />`;
            weatherText = "Sunny London";
            break;
        
        case (code >= 1 && code <= 3): // Mainly clear, partly cloudy, overcast
        case (code >= 45 && code <= 48): // Fog
            backgroundColor = '#B0C4DE';
            elements = `<circle cx="${width * 0.7}" cy="${height * 0.35}" r="70" fill="#F0E68C" />` +
                       `<circle cx="${width * 0.3}" cy="${height * 0.4}" r="60" fill="white" opacity="0.9" />` +
                       `<circle cx="${width * 0.45}" cy="${height * 0.45}" r="80" fill="white" opacity="0.9" />` +
                       `<circle cx="${width * 0.6}" cy="${height * 0.4}" r="70" fill="white" opacity="0.9" />`;
            weatherText = "Cloudy London";
            break;

        case (code >= 51 && code <= 67): // Drizzle, Rain
        case (code >= 80 && code <= 82): // Rain showers
            backgroundColor = '#778899';
            elements = `<circle cx="${width * 0.3}" cy="${height * 0.3}" r="60" fill="#B0C4DE" />` +
                       `<circle cx="${width * 0.45}" cy="${height * 0.35}" r="80" fill="#B0C4DE" />` +
                       `<circle cx="${width * 0.6}" cy="${height * 0.3}" r="70" fill="#B0C4DE" />`;
            for(let i=0; i<30; i++) {
                const x = Math.random() * width;
                const y = Math.random() * (height - height * 0.4) + height * 0.4;
                elements += `<line x1="${x}" y1="${y}" x2="${x+5}" y2="${y+15}" stroke="#4682B4" stroke-width="3" stroke-linecap="round" />`;
            }
            weatherText = "Rainy London";
            break;
        
        default:
            weatherText = `London (${code})`; // Hata ayıklama için kodu da yazdırabiliriz
            break;
    }
    
    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif;">
            <rect width="100%" height="100%" fill="${backgroundColor}" />
            ${elements}
            <text x="50%" y="90%" font-size="40" fill="white" text-anchor="middle" style="paint-order: stroke; stroke: #333; stroke-width: 2px;">
                ${weatherText}
            </text>
        </svg>
    `;
}


app.get('/api', (req, res) => {
    const weatherCode = parseInt(req.query.weather, 10) || 999;
    
    const svgImage = generateWeatherSVG(weatherCode);
    
    const base64Image = Buffer.from(svgImage).toString('base64');
    const imageDataURI = `data:image/svg+xml;base64,${base64Image}`;

    // Metadata'yı oluştur
    const metadata = {
        name: `London Weather NFT`,
        description: `An on-chain, dynamic representation of London's weather, updated hourly by Kwala. Current WMO code: ${weatherCode}`,
        image: imageDataURI,
        attributes: [{ "trait_type": "WMO Weather Code", "value": weatherCode }]
    };

    res.json(metadata);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
