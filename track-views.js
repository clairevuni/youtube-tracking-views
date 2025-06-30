import 'dotenv/config';
import {promises as fs} from 'fs';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const videoURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const dataFilePath = './data.json';

function extractVideoId(videoURL){
    try {
        const parsed = new URL(videoURL);
        if(parsed.hostname.includes('youtube.com')){
            return parsed.searchParams.get('v');
        } else if (parsed.hostname === 'youtu.be'){
            return parsed.pathname.slice(1);
        }
    } catch (e){
        console.error("URL non valido:", e.message);
        return null;
        
    }
}

async function fetchVideoViews(videoID){
    if (!videoID){
        console.error('ID video non valido');
        return null;
    }
    const apiURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoID}&key=${YOUTUBE_API_KEY}`;
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        if (data.items && data.items.length > 0){
            return data.items[0].statistics.viewCount;
        } else {
            console.error ('video non trovato');
            return null;
        }
    } catch (err){
        console.error ('errore fetch api:', err);
    }
}

async function trackAndSaveViews(){
    console.log("Inizio tracciamento...");
    const videoID = extractVideoId(videoURL);
    const viewCount = await fetchVideoViews(videoID);

    if (viewCount === null){
        console.log("Tracciamento Fallito");
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newRecord = {date: today, views: parseInt(viewCount, 10)};
    console.log("Nuovo Record:", newRecord);

    let data = [];
    try {
        const fileContent = await fs.readFile(dataFilePath);
        data = JSON.parse(fileContent);
    } catch (error) {
        console.log("File dati non trovato. Ne verrà creato uno nuovo");
    }

    data.push(newRecord);

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    console.log(`Dati salvati con successo in ${dataFilePath}`);
}


trackAndSaveViews();