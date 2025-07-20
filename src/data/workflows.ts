
import { Workflow } from '@/types/workflow';

export const predefinedWorkflows: Workflow[] = [
  // Low Complexity Workflows
  {
    id: 'welcome-email',
    title: 'Welcome Email Automation',
    description: 'Sends welcome emails to new employees with onboarding materials',
    trigger: 'New employee added to system',
    complexity: 'low',
    status: 'completed',
    successRate: 99,
    avgRunTime: '1m 12s',
    nodes: [
      {
        id: 'trigger-node',
        type: 'io',
        title: 'New Employee Trigger',
        position: { x: 150, y: 100 },
        description: 'Triggered when new employee is added',
        status: 'completed',
        tags: ['Input', 'HR System']
      },
      {
        id: 'email-sender',
        type: 'agent',
        title: 'EmailSenderAgent',
        position: { x: 400, y: 100 },
        description: 'Sends welcome email with handbook',
        status: 'completed',
        tags: ['Email', 'Notification']
      },
      {
        id: 'output-node',
        type: 'io',
        title: 'Completion Log',
        position: { x: 650, y: 100 },
        description: 'Records email delivery status',
        status: 'completed',
        tags: ['Output', 'Log']
      }
    ],
    connections: [
      {
        id: 'c1',
        source: 'trigger-node',
        target: 'email-sender'
      },
      {
        id: 'c2',
        source: 'email-sender',
        target: 'output-node'
      }
    ]
  },
  {
    id: 'invoice-logging',
    title: 'Invoice Receipt Logging',
    description: 'Automatically processes invoice emails and logs data to Google Sheets',
    trigger: 'Email with invoice attachment',
    complexity: 'low',
    status: 'completed',
    successRate: 95,
    avgRunTime: '2m 48s',
    nodes: [
      {
        id: 'email-trigger',
        type: 'io',
        title: 'Invoice Email Trigger',
        position: { x: 150, y: 100 },
        description: 'Email with invoice received',
        status: 'completed',
        tags: ['Email', 'Trigger']
      },
      {
        id: 'parser-agent',
        type: 'agent',
        title: 'EmailParserAgent',
        position: { x: 400, y: 100 },
        description: 'Extracts invoice data from email',
        status: 'completed',
        tags: ['Parser', 'OCR']
      },
      {
        id: 'data-storer',
        type: 'agent',
        title: 'DataStorerAgent',
        position: { x: 650, y: 100 },
        description: 'Writes data to Google Sheets',
        status: 'completed',
        tags: ['Google Sheets', 'Data Entry']
      }
    ],
    connections: [
      {
        id: 'c1',
        source: 'email-trigger',
        target: 'parser-agent'
      },
      {
        id: 'c2',
        source: 'parser-agent',
        target: 'data-storer'
      }
    ]
  },
  {
    id: 'daily-standup',
    title: 'Daily Standup Summary',
    description: 'Aggregates daily standup messages and creates a summary report',
    trigger: '9AM cron job',
    complexity: 'low',
    status: 'idle',
    successRate: 98,
    avgRunTime: '3m 20s',
    nodes: [
      {
        id: 'cron-trigger',
        type: 'io',
        title: '9AM Cron Trigger',
        position: { x: 150, y: 100 },
        description: 'Runs at 9AM daily',
        tags: ['Scheduler', 'Time-based']
      },
      {
        id: 'slack-scraper',
        type: 'agent',
        title: 'SlackScraperAgent',
        position: { x: 350, y: 100 },
        description: 'Gets messages from standup channel',
        tags: ['Slack', 'API']
      },
      {
        id: 'summarizer',
        type: 'agent',
        title: 'SummarizerAgent',
        position: { x: 550, y: 100 },
        description: 'Creates daily report summary',
        tags: ['NLP', 'Summary']
      },
      {
        id: 'slack-poster',
        type: 'agent',
        title: 'SlackPosterAgent',
        position: { x: 750, y: 100 },
        description: 'Posts summary to management channel',
        tags: ['Slack', 'Notification']
      }
    ],
    connections: [
      {
        id: 'c1',
        source: 'cron-trigger',
        target: 'slack-scraper'
      },
      {
        id: 'c2',
        source: 'slack-scraper',
        target: 'summarizer'
      },
      {
        id: 'c3',
        source: 'summarizer',
        target: 'slack-poster'
      }
    ]
  },
  {
    id: 'website-monitor',
    title: 'Website Uptime Monitor',
    description: 'Monitors website health and sends alerts if issues are detected',
    trigger: '5 minute ping check',
    complexity: 'low',
    status: 'idle',
    successRate: 99.8,
    avgRunTime: '45s',
    nodes: [
      {
        id: 'scheduler',
        type: 'io',
        title: 'Health Check Scheduler',
        position: { x: 150, y: 100 },
        description: 'Runs every 5 minutes',
        tags: ['Scheduler']
      },
      {
        id: 'health-checker',
        type: 'agent',
        title: 'HealthCheckAgent',
        position: { x: 350, y: 100 },
        description: 'Pings endpoints to check status',
        tags: ['API', 'Monitoring']
      },
      {
        id: 'conditional',
        type: 'logic',
        title: 'Status Check',
        position: { x: 550, y: 100 },
        description: 'If status != 200, alert team',
        tags: ['Conditional']
      },
      {
        id: 'alert-agent',
        type: 'agent',
        title: 'SlackAlertAgent',
        position: { x: 750, y: 150 },
        description: 'Sends alert on failure',
        tags: ['Slack', 'Alert']
      },
      {
        id: 'log-success',
        type: 'io',
        title: 'Log Success',
        position: { x: 750, y: 50 },
        description: 'Records successful check',
        tags: ['Log']
      }
    ],
    connections: [
      {
        id: 'c1',
        source: 'scheduler',
        target: 'health-checker'
      },
      {
        id: 'c2',
        source: 'health-checker',
        target: 'conditional'
      },
      {
        id: 'c3',
        source: 'conditional',
        target: 'alert-agent'
      },
      {
        id: 'c4',
        source: 'conditional',
        target: 'log-success'
      }
    ]
  },
  {
    id: 'ticket-triage',
    title: 'Support Ticket Triage',
    description: 'Analyzes incoming support tickets and assigns priority labels',
    trigger: 'Zendesk ticket created',
    complexity: 'low',
    status: 'running',
    successRate: 92,
    avgRunTime: '1m 35s',
    nodes: [
      {
        id: 'zendesk-trigger',
        type: 'io',
        title: 'Zendesk Ticket Created',
        position: { x: 150, y: 100 },
        description: 'New ticket webhook',
        tags: ['Zendesk', 'Webhook']
      },
      {
        id: 'sentiment-analysis',
        type: 'agent',
        title: 'SentimentAnalysisAgent',
        position: { x: 400, y: 100 },
        description: 'Analyzes customer sentiment',
        status: 'running',
        tags: ['NLP', 'Analysis']
      },
      {
        id: 'auto-label',
        type: 'agent',
        title: 'AutoLabelAgent',
        position: { x: 650, y: 100 },
        description: 'Applies priority and category labels',
        tags: ['Labeling', 'Classification']
      }
    ],
    connections: [
      {
        id: 'c1',
        source: 'zendesk-trigger',
        target: 'sentiment-analysis'
      },
      {
        id: 'c2',
        source: 'sentiment-analysis',
        target: 'auto-label'
      }
    ]
  },
  // Medium Complexity Workflows
  {
    id: 'document-review',
    title: 'Document Review Pipeline',
    description: 'Analyzes legal documents for potential issues and flags for review',
    trigger: 'Legal document upload',
    complexity: 'medium',
    status: 'idle',
    successRate: 87,
    avgRunTime: '4m 23s',
    nodes: [
      {
        id: 'doc-upload',
        type: 'io',
        title: 'Document Upload',
        position: { x: 150, y: 150 },
        description: 'Legal document uploaded',
        tags: ['Input', 'File']
      },
      {
        id: 'parser',
        type: 'agent',
        title: 'DocParserAgent',
        position: { x: 350, y: 150 },
        description: 'Extracts text and structure',
        tags: ['Parser', 'OCR']
      },
      {
        id: 'summarizer',
        type: 'agent',
        title: 'SummarizerAgent',
        position: { x: 550, y: 150 },
        description: 'Creates document summary',
        tags: ['NLP', 'Summary']
      },
      {
        id: 'analyzer',
        type: 'agent',
        title: 'FlagAnalyzerAgent',
        position: { x: 750, y: 150 },
        description: 'Identifies potential issues',
        tags: ['Analysis', 'Risk']
      },
      {
        id: 'flag-check',
        type: 'logic',
        title: 'Flags Present?',
        position: { x: 950, y: 150 },
        description: 'Checks if issues were found',
        tags: ['Conditional']
      },
      {
        id: 'human-review',
        type: 'human',
        title: 'Human Approval',
        position: { x: 1150, y: 200 },
        description: 'Manual review of flagged issues',
        tags: ['Review', 'Approval']
      },
      {
        id: 'auto-approve',
        type: 'io',
        title: 'Auto Approval',
        position: { x: 1150, y: 100 },
        description: 'Document approved automatically',
        tags: ['Output']
      }
    ],
    connections: [
      { id: 'c1', source: 'doc-upload', target: 'parser' },
      { id: 'c2', source: 'parser', target: 'summarizer' },
      { id: 'c3', source: 'summarizer', target: 'analyzer' },
      { id: 'c4', source: 'analyzer', target: 'flag-check' },
      { id: 'c5', source: 'flag-check', target: 'human-review' },
      { id: 'c6', source: 'flag-check', target: 'auto-approve' }
    ]
  },
  {
    id: 'kpi-digest',
    title: 'KPI Digest Generator',
    description: 'Creates weekly KPI reports from various data sources',
    trigger: 'Every Monday at 6AM',
    complexity: 'medium',
    status: 'completed',
    successRate: 94,
    avgRunTime: '7m 12s',
    nodes: [
      {
        id: 'monday-trigger',
        type: 'io',
        title: 'Monday 6AM Trigger',
        position: { x: 150, y: 150 },
        description: 'Weekly scheduler',
        status: 'completed',
        tags: ['Scheduler']
      },
      {
        id: 'data-fetcher',
        type: 'agent',
        title: 'DataFetcherAgent',
        position: { x: 350, y: 150 },
        description: 'Retrieves data from multiple sources',
        status: 'completed',
        tags: ['API', 'Data']
      },
      {
        id: 'visualizer',
        type: 'agent',
        title: 'VisualizerAgent',
        position: { x: 550, y: 150 },
        description: 'Generates charts and graphs',
        status: 'completed',
        tags: ['Visualization', 'Charts']
      },
      {
        id: 'pdf-generator',
        type: 'agent',
        title: 'PDFGeneratorAgent',
        position: { x: 750, y: 150 },
        description: 'Creates formatted PDF report',
        status: 'completed',
        tags: ['PDF', 'Report']
      },
      {
        id: 'email-dispatcher',
        type: 'agent',
        title: 'EmailDispatcherAgent',
        position: { x: 950, y: 150 },
        description: 'Emails report to stakeholders',
        status: 'completed',
        tags: ['Email', 'Delivery']
      }
    ],
    connections: [
      { id: 'c1', source: 'monday-trigger', target: 'data-fetcher' },
      { id: 'c2', source: 'data-fetcher', target: 'visualizer' },
      { id: 'c3', source: 'visualizer', target: 'pdf-generator' },
      { id: 'c4', source: 'pdf-generator', target: 'email-dispatcher' }
    ]
  },
  {
    id: 'onboarding',
    title: 'Onboarding Workflow',
    description: 'Manages new employee onboarding process and tasks',
    trigger: 'New hire signed offer',
    complexity: 'medium',
    status: 'running',
    successRate: 90,
    avgRunTime: '2d 4h',
    nodes: [
      {
        id: 'new-hire-trigger',
        type: 'io',
        title: 'New Hire Trigger',
        position: { x: 150, y: 175 },
        description: 'Triggered when offer is signed',
        status: 'completed',
        tags: ['Trigger', 'HR']
      },
      {
        id: 'account-provision',
        type: 'agent',
        title: 'AccountProvisionerAgent',
        position: { x: 350, y: 175 },
        description: 'Creates accounts in systems',
        status: 'completed',
        tags: ['Accounts', 'Provisioning']
      },
      {
        id: 'meeting-scheduler',
        type: 'agent',
        title: 'MeetingSchedulerAgent',
        position: { x: 550, y: 175 },
        description: 'Schedules onboarding meetings',
        status: 'running',
        tags: ['Calendar', 'Scheduling']
      },
      {
        id: 'location-check',
        type: 'logic',
        title: 'Is Remote Employee?',
        position: { x: 750, y: 175 },
        description: 'Checks if employee is remote',
        tags: ['Conditional', 'Logic']
      },
      {
        id: 'equipment-shipping',
        type: 'agent',
        title: 'EquipmentShippingAgent',
        position: { x: 950, y: 250 },
        description: 'Ships equipment to remote employee',
        tags: ['Shipping', 'Equipment']
      },
      {
        id: 'checklist-builder',
        type: 'agent',
        title: 'ChecklistBuilderAgent',
        position: { x: 950, y: 100 },
        description: 'Creates onboarding checklists',
        tags: ['Checklist', 'Tasks']
      }
    ],
    connections: [
      { id: 'c1', source: 'new-hire-trigger', target: 'account-provision' },
      { id: 'c2', source: 'account-provision', target: 'meeting-scheduler' },
      { id: 'c3', source: 'meeting-scheduler', target: 'location-check' },
      { id: 'c4', source: 'location-check', target: 'equipment-shipping' },
      { id: 'c5', source: 'location-check', target: 'checklist-builder' }
    ]
  },
  // High Complexity Workflows
  {
    id: 'contract-generation',
    title: 'Contract Generation + Redlining',
    description: 'Creates and analyzes contracts based on deal requirements',
    trigger: 'Deal won in CRM',
    complexity: 'high',
    status: 'idle',
    successRate: 82,
    avgRunTime: '8h 27m',
    nodes: [
      {
        id: 'deal-won',
        type: 'io',
        title: 'Deal Won Trigger',
        position: { x: 150, y: 200 },
        description: 'New won deal in CRM',
        tags: ['CRM', 'Trigger']
      },
      {
        id: 'template-filler',
        type: 'agent',
        title: 'TemplateFillerAgent',
        position: { x: 350, y: 200 },
        description: 'Populates contract template',
        tags: ['Templates', 'Documents']
      },
      {
        id: 'risk-analyzer',
        type: 'agent',
        title: 'RiskAnalyzerAgent',
        position: { x: 550, y: 200 },
        description: 'Identifies contract risks',
        tags: ['Risk', 'Analysis']
      },
      {
        id: 'clause-recommender',
        type: 'agent',
        title: 'ClauseRecommenderAgent',
        position: { x: 750, y: 200 },
        description: 'Suggests improved clauses',
        tags: ['Legal', 'AI']
      },
      {
        id: 'risk-check',
        type: 'logic',
        title: 'Red Flags Present?',
        position: { x: 950, y: 200 },
        description: 'Evaluates risk severity',
        tags: ['Conditional', 'Risk']
      },
      {
        id: 'legal-review',
        type: 'human',
        title: 'Legal Review',
        position: { x: 1150, y: 150 },
        description: 'Standard legal review process',
        tags: ['Review', 'Legal']
      },
      {
        id: 'legal-director',
        type: 'human',
        title: 'Legal Director Review',
        position: { x: 1150, y: 250 },
        description: 'Senior review for high-risk items',
        tags: ['Escalation', 'Legal']
      }
    ],
    connections: [
      { id: 'c1', source: 'deal-won', target: 'template-filler' },
      { id: 'c2', source: 'template-filler', target: 'risk-analyzer' },
      { id: 'c3', source: 'risk-analyzer', target: 'clause-recommender' },
      { id: 'c4', source: 'clause-recommender', target: 'risk-check' },
      { id: 'c5', source: 'risk-check', target: 'legal-review' },
      { id: 'c6', source: 'risk-check', target: 'legal-director' }
    ]
  },
  {
    id: 'incident-response',
    title: 'Incident Response Automation',
    description: 'Automates response to security incidents and alerts',
    trigger: 'Security alert detected',
    complexity: 'high',
    status: 'error',
    successRate: 95,
    avgRunTime: '15m 42s',
    nodes: [
      {
        id: 'alert-trigger',
        type: 'io',
        title: 'Security Alert',
        position: { x: 150, y: 225 },
        description: 'Security monitoring alert',
        status: 'completed',
        tags: ['Security', 'Alert']
      },
      {
        id: 'classifier',
        type: 'agent',
        title: 'SeverityClassifierAgent',
        position: { x: 350, y: 225 },
        description: 'Determines incident severity',
        status: 'completed',
        tags: ['Classification', 'Severity']
      },
      {
        id: 'severity-check',
        type: 'logic',
        title: 'Is Critical?',
        position: { x: 550, y: 225 },
        description: 'Check if severity is critical',
        status: 'completed',
        tags: ['Conditional']
      },
      {
        id: 'isolation',
        type: 'agent',
        title: 'AutoIsolationAgent',
        position: { x: 750, y: 150 },
        description: 'Automatically isolates affected systems',
        status: 'error',
        tags: ['Isolation', 'Security']
      },
      {
        id: 'human-approval',
        type: 'human',
        title: 'Isolation Approval',
        position: { x: 750, y: 300 },
        description: 'Get approval for isolation actions',
        status: 'idle',
        tags: ['Approval', 'Human']
      },
      {
        id: 'team-notifier',
        type: 'agent',
        title: 'TeamNotifierAgent',
        position: { x: 950, y: 225 },
        description: 'Notifies security team',
        status: 'idle',
        tags: ['Notification', 'Team']
      },
      {
        id: 'rca-initiator',
        type: 'agent',
        title: 'RCAInitiatorAgent',
        position: { x: 1150, y: 225 },
        description: 'Starts root cause analysis',
        status: 'idle',
        tags: ['RCA', 'Analysis']
      }
    ],
    connections: [
      { id: 'c1', source: 'alert-trigger', target: 'classifier' },
      { id: 'c2', source: 'classifier', target: 'severity-check' },
      { id: 'c3', source: 'severity-check', target: 'isolation' },
      { id: 'c4', source: 'severity-check', target: 'human-approval' },
      { id: 'c5', source: 'isolation', target: 'team-notifier' },
      { id: 'c6', source: 'human-approval', target: 'team-notifier' },
      { id: 'c7', source: 'team-notifier', target: 'rca-initiator' }
    ]
  }
];

// Group workflows by complexity
export const groupedWorkflows = {
  low: predefinedWorkflows.filter(w => w.complexity === 'low'),
  medium: predefinedWorkflows.filter(w => w.complexity === 'medium'),
  high: predefinedWorkflows.filter(w => w.complexity === 'high')
};
