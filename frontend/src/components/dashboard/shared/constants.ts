export const TIME_ZONES = Array.from(new Set([
    "(UTC+04:00) Abu Dhabi, Muscat, Baku",
    "(UTC+09:30) Adelaide, Darwin",
    "(UTC-09:00) Alaska",
    "(UTC+06:00) Almaty, Novosibirsk, Dhaka",
    "(UTC+03:00) Arabia Standard Time, Riyadh",
    "(UTC-04:00) Atlantic Time (Canada)",
    "(UTC+12:00) Auckland, Wellington, Fiji",
    "(UTC-01:00) Azores, Cape Verde Islands",
    "(UTC+03:00) Baghdad, Moscow, St. Petersburg",
    "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    "(UTC+08:00) Beijing, Hong Kong, Singapore",
    "(UTC+01:00) Berlin, Paris, Madrid, Rome",
    "(UTC-05:00) Bogota, Lima, Quito",
    "(UTC-03:00) Brazil, Buenos Aires, Georgetown",
    "(UTC+02:00) Cairo, Egypt, Johannesburg",
    "(UTC+10:00) Canberra, Melbourne, Sydney",
    "(UTC-06:00) Central Time (US & Canada)",
    "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    "(UTC-05:00) Eastern Time (US & Canada)",
    "(UTC-10:00) Hawaii",
    "(UTC+05:00) Islamabad, Karachi, Tashkent",
    "(UTC+04:30) Kabul",
    "(UTC+05:45) Kathmandu",
    "(UTC+00:00) London, Lisbon, Casablanca",
    "(UTC+11:00) Magadan, Solomon Islands",
    "(UTC-06:00) Mexico City, Monterrey",
    "(UTC-02:00) Mid-Atlantic",
    "(UTC-11:00) Midway Island, Samoa",
    "(UTC-07:00) Mountain Time (US & Canada)",
    "(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul",
    "(UTC-08:00) Pacific Time (US & Canada)",
    "(UTC+03:30) Tehran",
    "(UTC+06:30) Yangon (Rangoon)"
])).sort();

export interface CaseMock {
    id: number;
    title: string;
    client: string;
    location: string;
    timeAgo: string;
    budget: string;
    type: string;
    tags: string[];
    logoColor: string;
}

export const mockCases: CaseMock[] = [
    { id: 1, title: 'Full Stack Next.js & .NET Developer Needed', client: 'TechCorp', location: 'Remote', timeAgo: '2 hours ago', budget: '$1200 - $2500', type: 'Freelance', tags: ['Urgent', 'Full Time'], logoColor: '#ff4b2b' },
    { id: 2, title: 'UI/UX Designer for Mobile App Redesign', client: 'StudioX', location: 'Remote', timeAgo: '5 hours ago', budget: '$800 - $1200', type: 'Temporary', tags: ['Design', 'Figma'], logoColor: '#3498db' },
    { id: 3, title: 'Database Optimization Expert (SQL Server)', client: 'DataFlow Inc.', location: 'Cairo, Egypt', timeAgo: '1 day ago', budget: '$3000+', type: 'Contract', tags: ['Database', 'Senior'], logoColor: '#2ecc71' },
    { id: 4, title: 'React Native Developer for E-commerce', client: 'ShopifyPlus', location: 'Remote', timeAgo: '2 days ago', budget: '$1500 - $2000', type: 'Freelance', tags: ['Mobile', 'React'], logoColor: '#9b59b6' },
];

export interface ProposalMock {
    id: number;
    jobTitle: string;
    message: string;
    price: string;
    duration: string;
    status: 'pending' | 'accepted' | 'rejected';
    date: string;
}

export const mockProposals: ProposalMock[] = [
    { id: 1, jobTitle: 'Full Stack Next.js & .NET Developer Needed', message: 'I have extensive experience with Next.js...', price: '$2000', duration: '3 weeks', status: 'pending', date: '2026-04-25' },
    { id: 2, jobTitle: 'UI/UX Designer for Mobile App Redesign', message: 'I can help with the Figma designs...', price: '$1000', duration: '2 weeks', status: 'accepted', date: '2026-04-20' }
];

export interface ActiveJobMock {
    id: number;
    title: string;
    client: string;
    price: string;
    deadline: string;
    status: 'in_progress' | 'completed';
}

export const mockActiveJobs: ActiveJobMock[] = [
    { id: 1, title: 'UI/UX Designer for Mobile App Redesign', client: 'StudioX', price: '$1000', deadline: '2026-05-15', status: 'in_progress' }
];

export interface PostedJob {
    id: number;
    description: string;
    status: string;
    applicants: number;
    postedDate: string;
}

export const mockPostedJobs: PostedJob[] = [
    { id: 1, description: 'Build a Next.js E-commerce Platform with full integration', status: 'Active', applicants: 12, postedDate: 'Oct 24, 2023' },
    { id: 2, description: 'Database Migration to SQL Server and optimization', status: 'Active', applicants: 5, postedDate: 'Oct 26, 2023' },
    { id: 3, description: 'UI Redesign for Mobile App based on Figma', status: 'Closed', applicants: 28, postedDate: 'Sep 15, 2023' },
];
