# Orchestra

A production-ready orchestration platform built with React, TypeScript, and modern web technologies. Orchestra provides a comprehensive workflow management system with AI-powered orchestration capabilities.

## Features

- **Modern Architecture**: Built with React 18, TypeScript, and Vite for optimal performance
- **Workflow Management**: Create, execute, and monitor complex workflows
- **Agent Directory**: Manage AI agents with profiles, roles, and execution capabilities
- **Dashboard**: Real-time overview of system activity and workflow execution
- **Mock Authentication**: Lightweight authentication system without external dependencies
- **Code Splitting**: Optimized bundle loading with lazy components
- **Error Boundaries**: Robust error handling for production reliability

## Technologies Used

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management

## Project Structure

```
simple-orchestra/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Application pages/routes
│   ├── lib/             # Utilities and core logic
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── services/        # API services and external integrations
├── public/              # Static assets
└── dist/               # Production build output
```

## Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/y-m0/orchestra.git
cd orchestra
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built application will be in the `dist/` directory.

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t simple-orchestra .
docker run -p 3000:3000 simple-orchestra
```

### Cloud Platforms

Orchestra can be deployed to any static hosting platform:
- Vercel
- Netlify  
- Google Cloud Run
- AWS S3 + CloudFront

## Claude Flow Integration

This project integrates with [Claude Flow](https://github.com/ruvnet/claude-flow) for AI-powered orchestration, agent-based task management, and workflow monitoring.

### Setup
1. Install and run Claude Flow as a service
2. Update `CLAUDE_FLOW_API_URL` in `src/services/claudeFlowApi.ts` if your Claude Flow server is not on `localhost:3001`

### Key Components
- **ClaudeFlowDashboard**: Shows orchestration/workflow status
- **ClaudeFlowTaskTrigger**: Trigger new orchestration tasks  
- **ClaudeFlowStatus**: Real-time agent/task progress
- **ClaudeFlowSecurity**: Security & compliance results

### Example Workflow
1. User logs in to Orchestra
2. User triggers an orchestration task (e.g., "Deploy Microservice")
3. Frontend sends request to Claude Flow to spawn appropriate agents
4. Claude Flow agents execute tasks (deploy, monitor, summarize, secure)
5. Frontend displays real-time progress and results

## Authentication

Orchestra includes a mock authentication system for development and demonstration purposes. For production use, replace with your preferred authentication provider.

## Performance Optimizations

- **Bundle Splitting**: Main bundle optimized to 574KB with 42 additional chunks
- **Lazy Loading**: Components loaded on-demand to reduce initial bundle size
- **Error Boundaries**: Graceful error handling prevents application crashes
- **Type Safety**: Full TypeScript coverage prevents runtime errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support, please open an issue on GitHub or contact the maintainers.