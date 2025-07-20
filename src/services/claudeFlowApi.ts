// Claude-Flow API service layer
// Update CLAUDE_FLOW_API_URL to match your Claude-Flow server
const CLAUDE_FLOW_API_URL = 'http://localhost:3001';

export async function getWorkflowStatus() {
  const res = await fetch(`${CLAUDE_FLOW_API_URL}/api/workflow/status`);
  if (!res.ok) throw new Error('Failed to fetch workflow status');
  return res.json();
}

export async function triggerOrchestration(task: string) {
  const res = await fetch(`${CLAUDE_FLOW_API_URL}/api/hive-mind/spawn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error('Failed to trigger orchestration');
  return res.json();
}

export async function getSecurityAnalysis() {
  const res = await fetch(`${CLAUDE_FLOW_API_URL}/api/github/gh-coordinator/analyze?analysis-type=security&target=./src`);
  if (!res.ok) throw new Error('Failed to fetch security analysis');
  return res.json();
} 