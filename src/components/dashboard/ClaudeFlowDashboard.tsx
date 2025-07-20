import React, { useEffect, useState } from 'react';
import { getWorkflowStatus } from '../../services/claudeFlowApi';

const ClaudeFlowDashboard: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getWorkflowStatus();
        setStatus(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Claude-Flow Orchestration</h2>
      {error && <div className="text-red-500">{error}</div>}
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {status ? JSON.stringify(status, null, 2) : 'Loading...'}
      </pre>
    </div>
  );
};

export default ClaudeFlowDashboard; 