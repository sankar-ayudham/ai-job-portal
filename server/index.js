import cors from 'cors';


app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://ai-job-portal-sandy.vercel.app' 
    ],
    credentials: true
}));
