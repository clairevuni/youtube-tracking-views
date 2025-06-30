// Funzione per creare il grafico
async function createChart() {
    // Facciamo una richiesta al nostro server per ottenere i dati
    const response = await fetch('/api/data');
    const data = await response.json();

    // Prepariamo i dati per Chart.js
    const labels = data.map(record => record.date); // ['2023-10-26', '2023-10-27', ...]
    const viewData = data.map(record => record.views); // [100, 150, ...]

    const ctx = document.getElementById('viewsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line', // Tipo di grafico: linea
        data: {
            labels: labels,
            datasets: [{
                label: 'Visualizzazioni del video',
                data: viewData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.1 // Rende la linea leggermente curva
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false // Inizia l'asse Y da un valore sensato
                }
            }
        }
    });
}

// Avviamo la creazione del grafico quando la pagina è pronta
createChart();