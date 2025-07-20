import React, { useEffect, useState } from 'react';
import { getWorkflowStatus } from '../../services/claudeFlowApi';

const ClaudeFlowStatus: React.FC = () => {
  const [progress, setProgress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getWorkflowStatus();
        setProgress(data?.progress || data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchProgress();
    const interval = setInterval(fetchProgress, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Agent/Task Progress</h3>
      {error && <div className="text-red-500">{error}</div>}
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {progress ? JSON.stringify(progress, null, 2) : 'Loading...'}
      </pre>
    </div>
  );
};

export default ClaudeFlowStatus; 