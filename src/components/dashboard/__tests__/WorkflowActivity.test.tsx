
import { render, screen, waitFor } from '@testing-library/react';
import { WorkflowActivity } from '../WorkflowActivity';
import { useStore } from '@/lib/store';
import { useWorkflow } from '@/hooks/useWorkflow';
import type { Activity } from '@/lib/store';

// Mock the store and workflow hooks
jest.mock('@/lib/store', () => {
  return {
    useStore: jest.fn()
  };
});

jest.mock('@/hooks/useWorkflow', () => ({
  useWorkflow: jest.fn(),
}));

describe('WorkflowActivity', () => {
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'workflow',
      status: 'completed',
      workflowId: 'workflow-1',
      workflowName: 'Test Workflow',
      timestamp: new Date().toISOString(),
      details: {
        steps: 5,
        duration: 1000,
      },
    },
    {
      id: '2',
      type: 'workflow',
      status: 'error',
      workflowId: 'workflow-2',
      workflowName: 'Error Workflow',
      timestamp: new Date().toISOString(),
      details: {
        error: 'Test error message',
      },
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Use a mock implementation that returns a minimal store object
    (useStore as jest.MockedFunction<typeof useStore>).mockImplementation(() => ({
      activities: mockActivities,
      setActivities: jest.fn(),
      // Add any other required properties from the store
    }));

    (useWorkflow as jest.Mock).mockReturnValue({
      currentWorkflow: null,
      isRunning: false,
      runWorkflow: jest.fn(),
      stopWorkflow: jest.fn(),
    });
  });

  it('should render the activity log with correct title', () => {
    render(<WorkflowActivity />);
    expect(screen.getByText('Workflow Activity Log')).toBeInTheDocument();
  });

  it('should display activities grouped by date', async () => {
    render(<WorkflowActivity />);
    
    // Check if activities are rendered
    await waitFor(() => {
      expect(screen.getByText('Test Workflow')).toBeInTheDocument();
      expect(screen.getByText('Error Workflow')).toBeInTheDocument();
    });
  });

  it('should show activity status badges', async () => {
    render(<WorkflowActivity />);
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  it('should display activity details in dialog when clicked', async () => {
    render(<WorkflowActivity />);
    
    // Click on the first activity
    const activityCard = screen.getByText('Test Workflow').closest('div');
    activityCard?.click();

    // Check if dialog opens with correct details
    await waitFor(() => {
      expect(screen.getByText('Activity Details')).toBeInTheDocument();
      expect(screen.getByText('Steps: 5')).toBeInTheDocument();
      expect(screen.getByText('Duration: 1000ms')).toBeInTheDocument();
    });
  });

  it('should handle error activities correctly', async () => {
    render(<WorkflowActivity />);
    
    // Click on the error activity
    const errorCard = screen.getByText('Error Workflow').closest('div');
    errorCard?.click();

    // Check if error details are displayed
    await waitFor(() => {
      expect(screen.getByText('Error Details')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });
});
