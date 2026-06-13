import cors from 'cors';


app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://your-exact-vercel-url.vercel.app' 
    ],
    credentials: true
}));