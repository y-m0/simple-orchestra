import React, { useEffect, useState } from 'react';
import { getSecurityAnalysis } from '../../services/claudeFlowApi';

const ClaudeFlowSecurity: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSecurityAnalysis()
      .then(setResults)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Security & Compliance Results</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {results ? JSON.stringify(results, null, 2) : 'No results yet.'}
      </pre>
    </div>
  );
};

export default ClaudeFlowSecurity; 