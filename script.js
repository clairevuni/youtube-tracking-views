import {YOUTUBE_API_KEY} from './config.js';

const videoURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

function extractVideoId(videoURL){
    try {
        const parsed = new URL(videoURL);
        if(parsed.hostname.includes('youtube.com')){
            return parsed.searchParams.get('v');
        } else if (parsed.hostname === 'youtu.be'){
            return parsed.pathname.slice(1);
        }
    } catch (e){
        return console.error("??");
        
    }
}

async function fetchVideoViews(videoID){
    if (!videoID){
        console.error('ID video non valido');
        return;
    }
    const apiURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoID}&key=${YOUTUBE_API_KEY}`;
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        if (data.items && data.items.length > 0){
            console.log(`Views: ${data.items[0].statistics.viewCount}`);
            return data.items[0].statistics.viewCount;
        } else {
            console.error ('video non trovato');
        }
    } catch (err){
        console.error ('errore fetch api:', err);
    }
}

const videoID = extractVideoId(videoURL);
fetchVideoViews(videoID);