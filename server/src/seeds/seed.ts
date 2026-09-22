import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { Job } from '../entities/Job';
import { hashPassword } from '../utils/password.utils';

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'GraphQL',
  'Vue.js', 'Next.js', 'Go', 'Rust', 'Kubernetes',
];

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('🌱 Starting seed...');

    const userRepo = AppDataSource.getRepository(User);
    const skillRepo = AppDataSource.getRepository(Skill);
    const jobRepo = AppDataSource.getRepository(Job);

    // Clear existing data
    await AppDataSource.query('TRUNCATE TABLE user_skills, job_skills, saved_jobs, applications, jobs, skills, users RESTART IDENTITY CASCADE');
    console.log('🗑️  Cleared existing data');

    // Create Skills
    const skillEntities = skillRepo.create(SKILLS.map(name => ({ name })));
    const savedSkills = await skillRepo.save(skillEntities);
    console.log(`✅ Created ${savedSkills.length} skills`);

    // Create Admin user
    const adminHash = await hashPassword('Admin@123456');
    const admin = userRepo.create({
      name: 'DevConnect Admin',
      email: 'admin@devconnect.io',
      passwordHash: adminHash,
      role: 'admin',
      bio: 'Platform administrator',
      location: 'San Francisco, CA',
      experienceLevel: 'senior',
      skills: [],
    });
    await userRepo.save(admin);
    console.log('✅ Admin user created: admin@devconnect.io / Admin@123456');

    // Create Demo user
    const userHash = await hashPassword('User@123456');
    const demoUser = userRepo.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      passwordHash: userHash,
      role: 'user',
      bio: 'Full-stack developer passionate about building great products.',
      location: 'Austin, TX',
      experienceLevel: 'mid',
      skills: [savedSkills[0], savedSkills[1], savedSkills[2], savedSkills[3]],
    });
    await userRepo.save(demoUser);
    console.log('✅ Demo user created: alex@example.com / User@123456');

    const findSkills = (names: string[]) =>
      savedSkills.filter(s => names.includes(s.name));

    // Create Jobs
    const jobs = [
      {
        title: 'Senior Frontend Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        jobType: 'full-time' as const,
        salaryMin: 150000, salaryMax: 200000,
        description: 'Join Stripe\'s frontend team to build the financial infrastructure of the internet. You\'ll work on highly scalable React applications used by millions of businesses worldwide.\n\nResponsibilities:\n- Architect and build complex UI components\n- Collaborate with design and product teams\n- Mentor junior engineers\n- Drive technical decisions',
        skills: findSkills(['React', 'TypeScript', 'JavaScript']),
      },
      {
        title: 'Full Stack Developer',
        company: 'Vercel',
        location: 'Remote',
        jobType: 'remote' as const,
        salaryMin: 130000, salaryMax: 170000,
        description: 'Help us build the future of web development at Vercel. Work on Next.js and our deployment infrastructure.\n\nResponsibilities:\n- Develop features for the Vercel platform\n- Optimize build and deployment pipelines\n- Write maintainable TypeScript code\n- Participate in code reviews',
        skills: findSkills(['Next.js', 'TypeScript', 'Node.js', 'React']),
      },
      {
        title: 'Backend Engineer — Python',
        company: 'Airbnb',
        location: 'New York, NY',
        jobType: 'full-time' as const,
        salaryMin: 140000, salaryMax: 185000,
        description: 'Build and maintain the systems that power Airbnb\'s marketplace. Work with large-scale distributed systems serving millions of users daily.',
        skills: findSkills(['Python', 'PostgreSQL', 'Docker']),
      },
      {
        title: 'DevOps Engineer',
        company: 'Cloudflare',
        location: 'Austin, TX',
        jobType: 'full-time' as const,
        salaryMin: 120000, salaryMax: 160000,
        description: 'Manage and scale Cloudflare\'s global infrastructure. You\'ll work with Kubernetes, Terraform, and custom automation tools.',
        skills: findSkills(['Kubernetes', 'Docker', 'AWS']),
      },
      {
        title: 'React Native Developer',
        company: 'Shopify',
        location: 'Remote',
        jobType: 'remote' as const,
        salaryMin: 110000, salaryMax: 150000,
        description: 'Build and maintain Shopify\'s mobile applications used by merchants worldwide. You\'ll work in React Native with a team of mobile specialists.',
        skills: findSkills(['React', 'TypeScript', 'JavaScript']),
      },
      {
        title: 'GraphQL API Engineer',
        company: 'GitHub',
        location: 'Remote',
        jobType: 'remote' as const,
        salaryMin: 145000, salaryMax: 190000,
        description: 'Design and build GitHub\'s public GraphQL API, used by millions of developers every day. Deep dive into schema design, performance, and developer experience.',
        skills: findSkills(['GraphQL', 'Node.js', 'TypeScript']),
      },
      {
        title: 'Junior Frontend Developer',
        company: 'Linear',
        location: 'San Francisco, CA',
        jobType: 'full-time' as const,
        salaryMin: 80000, salaryMax: 110000,
        description: 'Join Linear as a junior frontend engineer and help shape the best project management tool for software teams. Great opportunity to grow under experienced mentors.',
        skills: findSkills(['React', 'JavaScript', 'TypeScript']),
      },
      {
        title: 'Platform Engineer',
        company: 'Figma',
        location: 'New York, NY',
        jobType: 'full-time' as const,
        salaryMin: 160000, salaryMax: 210000,
        description: 'Work on Figma\'s core platform team to build internal tooling, infrastructure, and developer experience improvements that accelerate the whole engineering org.',
        skills: findSkills(['TypeScript', 'Node.js', 'PostgreSQL', 'Docker']),
      },
      {
        title: 'Go Backend Engineer',
        company: 'Datadog',
        location: 'Boston, MA',
        jobType: 'full-time' as const,
        salaryMin: 155000, salaryMax: 200000,
        description: 'Build high-performance data ingestion and processing pipelines in Go. You\'ll handle billions of events per day and maintain sub-millisecond latency.',
        skills: findSkills(['Go', 'Kubernetes', 'PostgreSQL']),
      },
      {
        title: 'Vue.js Frontend Engineer',
        company: 'GitLab',
        location: 'Remote',
        jobType: 'remote' as const,
        salaryMin: 100000, salaryMax: 140000,
        description: 'Contribute to GitLab\'s open-source Vue.js frontend. Work transparently with a global remote-first team on one of the world\'s most-used DevOps platforms.',
        skills: findSkills(['Vue.js', 'JavaScript', 'GraphQL']),
      },
      {
        title: 'AWS Cloud Architect',
        company: 'Netflix',
        location: 'Los Angeles, CA',
        jobType: 'full-time' as const,
        salaryMin: 180000, salaryMax: 240000,
        description: 'Design and implement Netflix\'s next-generation cloud architecture. Lead AWS infrastructure strategy for the world\'s largest streaming platform.',
        skills: findSkills(['AWS', 'Kubernetes', 'Docker', 'Go']),
      },
      {
        title: 'Part-Time TypeScript Contractor',
        company: 'Notion',
        location: 'Remote',
        jobType: 'contract' as const,
        salaryMin: 80, salaryMax: 120,
        description: 'Contract engagement to help Notion migrate legacy JavaScript to TypeScript. Flexible hours, fully remote. Expected 20 hours/week for 3 months.',
        skills: findSkills(['TypeScript', 'JavaScript']),
      },
      {
        title: 'Rust Systems Engineer',
        company: 'Discord',
        location: 'San Francisco, CA',
        jobType: 'full-time' as const,
        salaryMin: 160000, salaryMax: 220000,
        description: 'Help Discord build its ultra-low-latency systems in Rust. You\'ll work on voice infrastructure, message routing, and other performance-critical systems.',
        skills: findSkills(['Rust', 'Go', 'Kubernetes']),
      },
      {
        title: 'MongoDB Database Engineer',
        company: 'Twilio',
        location: 'Denver, CO',
        jobType: 'full-time' as const,
        salaryMin: 125000, salaryMax: 165000,
        description: 'Twilio is looking for a database engineer specializing in MongoDB to help design and optimize our communication data layer serving billions of API calls.',
        skills: findSkills(['MongoDB', 'Node.js', 'TypeScript']),
      },
      {
        title: 'Next.js Full Stack Engineer',
        company: 'Loom',
        location: 'Remote',
        jobType: 'remote' as const,
        salaryMin: 120000, salaryMax: 160000,
        description: 'Build and scale Loom\'s video collaboration platform using Next.js, TypeScript, and PostgreSQL. Join a fast-growing team passionate about async communication.',
        skills: findSkills(['Next.js', 'React', 'TypeScript', 'PostgreSQL']),
      },
    ];

    for (const jobData of jobs) {
      const job = jobRepo.create({
        ...jobData,
        postedById: admin.id,
      });
      await jobRepo.save(job);
    }
    console.log(`✅ Created ${jobs.length} sample jobs`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:     admin@devconnect.io / Admin@123456');
    console.log('Dev user:  alex@example.com / User@123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
