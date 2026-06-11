import axios from 'axios';
import Job from '../models/Job.js';

export const fetchRemoteOKJobs = async (adminUserId) => {
    try {
        console.log('[Aggregator] Fetching live jobs from RemoteOK API...');
        
        // RemoteOK API doesn't require keys for basic access
        const { data } = await axios.get('https://remoteok.com/api');
        
        // RemoteOK returns legal info in index 0, actual jobs start at index 1
        const jobs = data.slice(1); 

        let added = 0;
        for (const job of jobs) {
            // Deduplication Check
            const exists = await Job.findOne({ externalId: `remoteok_${job.id}` });
            
            if (!exists) {
                await Job.create({
                    title: job.position || 'Remote Developer',
                    companyNameFallback: job.company,
                    description: job.description || 'No description provided.',
                    requirements: job.tags || [],
                    location: job.location || 'Remote',
                    salary: { 
                        min: job.salary_min || 0, 
                        max: job.salary_max || 0 
                    },
                    postedBy: adminUserId, // Assign external jobs to your admin account
                    experienceLevel: 'Mid Level',
                    employmentType: 'Full-time',
                    externalId: `remoteok_${job.id}`,
                    source: 'RemoteOK',
                    applyUrl: job.url
                });
                added++;
            }
        }
        console.log(`[Aggregator] Success! Added ${added} new jobs from RemoteOK.`);
    } catch (error) {
        console.error('[Aggregator] RemoteOK Fetch Error:', error.message);
    }
};