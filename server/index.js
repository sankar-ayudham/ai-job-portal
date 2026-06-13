app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://ai-job-portal-xi.vercel.app'
    ],
    credentials: true
}));