import cors from 'cors';


app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://vercel.com/sankar58s-projects/ai-job-portal' 
    ],
    credentials: true
}));