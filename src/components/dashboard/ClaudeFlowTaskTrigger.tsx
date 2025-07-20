import React, { useState } from 'react';
import { triggerOrchestration } from '../../services/claudeFlowApi';

const ClaudeFlowTaskTrigger: React.FC = () => {
  const [task, setTask] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrigger = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await triggerOrchestration(task);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Trigger Orchestration Task</h3>
      <input
        className="border p-2 rounded w-2/3 mr-2"
        type="text"
        placeholder="Enter task (e.g., Deploy Microservice)"
        value={task}
        onChange={e => setTask(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleTrigger}
        disabled={loading || !task}
      >
        {loading ? 'Triggering...' : 'Trigger'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && <pre className="bg-gray-100 p-2 rounded text-xs mt-2">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default ClaudeFlowTaskTrigger; 