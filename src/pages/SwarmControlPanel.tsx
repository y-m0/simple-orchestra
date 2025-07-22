import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SwarmControlPanel() {
  const location = useLocation();
  const [selectedSwarm, setSelectedSwarm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  
  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const swarmParam = params.get('swarm');
    const agentParam = params.get('agent');
    
    if (swarmParam) {
      setSelectedSwarm(swarmParam);
    }
    if (agentParam) {
      setSelectedAgent(agentParam);
    }
  }, [location.search]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Swarm Control Panel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Search & Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search swarms or agents..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Swarm
                  </label>
                  <select
                    value={selectedSwarm}
                    onChange={(e) => setSelectedSwarm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Swarms</option>
                    <option value="swarm-1">Swarm 1</option>
                    <option value="swarm-2">Swarm 2</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Agent
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Agents</option>
                    <option value="agent-1">Agent 1</option>
                    <option value="agent-2">Agent 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Control Panel</h2>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Search Query: {searchDebounce || 'None'}
                </div>
                <div className="text-sm text-gray-600">
                  Selected Swarm: {selectedSwarm || 'None'}
                </div>
                <div className="text-sm text-gray-600">
                  Selected Agent: {selectedAgent || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}