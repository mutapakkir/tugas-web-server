const express = require('express');
const app = express();
const port = 8000;


const motoGP = [
    { circuit: 'Losail', location: 'Qatar', winner: { firstName: 'Andrea', lastName: 'Dovizioso', country: 'Italy' } },
    { circuit: 'Autodromo', location: 'Argentine', winner: { firstName: 'Cal', lastName: 'Crutchlow', country: 'UK' } },
    { circuit: 'De Jerez', location: 'Spain', winner: { firstName: 'Valentino', lastName: 'Rossi', country: 'Italy' } },
    { circuit: 'Mugello', location: 'Italy', winner: { firstName: 'Andrea', lastName: 'Dovizioso', country: 'Italy' } }
];


function membuatTabel(data) {
    let tabel = data.map(item => `
        <tr>
            <td>${item.circuit}</td>
            <td>${item.location}</td>
            <td>${item.winner.firstName} ${item.winner.lastName}</td>
            <td>${item.winner.country}</td>
        </tr>
    `).join('');

    return `
        <html>
        <head>
            <title>Data MotoGP</title>
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Data MotoGP</h1>
            <table>
                <tr>
                    <th>Circuit</th>
                    <th>Location</th>
                    <th>Winner</th>
                    <th>Country</th>
                </tr>
                ${tabel}
            </table>
        </body>
        </html>
    `;
}


app.get('/', (req, res) => {
    res.send(membuatTabel(motoGP));
});

app.get('/country', (req, res) => {
    const groupedByCountry = motoGP.reduce((result, item) => {
        (result[item.winner.country] = result[item.winner.country] || []).push(item);
        return result;
    }, {});

    let html = `
        <html>
        <head><title>Data MotoGP by Country</title></head>
        <body>
            <h1>Data MotoGP Berdasarkan Negara</h1>
    `;

    for (const country in groupedByCountry) {
        html += `<h2>${country}</h2>`;
        html += membuatTabel(groupedByCountry[country]);
    }

    html += `</body></html>`;
    res.send(html);
});


app.get('/name', (req, res) => {
    const groupedByName = motoGP.reduce((result, item) => {
        const name = `${item.winner.firstName} ${item.winner.lastName}`;
        (result[name] = result[name] || []).push(item);
        return result;
    }, {});

    let html = `
        <html>
        <head><title>Data MotoGP by Winner</title></head>
        <body>
            <h1>Data MotoGP Berdasarkan Nama Pemenang</h1>
    `;

    for (const name in groupedByName) {
        html += `<h2>${name}</h2>`;
        html += membuatTabel(groupedByName[name]);
    }

    html += `</body></html>`;
    res.send(html);
});


app.use((req, res) => {
    res.status(400).send('<h1>Bad Request</h1><p>URL yang Anda minta tidak valid.</p>');
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
