import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../lib/workflowStore';
import { LLMNode } from './LLMNode';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { createDefaultLLMNode } from '../../lib/llm';

const nodeTypes = {
  llmNode: (props: NodeProps) => {
    const { data, ...rest } = props;
    return <LLMNode node={data.node} onDelete={() => {}} {...rest} />;
  },
};

export const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { addLLMNode } = useWorkflowStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (type === 'llm') {
        const newNode = {
          id: `node-${Date.now()}`,
          type: 'llmNode',
          position,
          data: { 
            label: 'LLM Node',
            node: createDefaultLLMNode('openai')
          },
        };

        setNodes((nds) => nds.concat(newNode));
        addLLMNode(createDefaultLLMNode('openai'));
      }
    },
    [reactFlowInstance, setNodes, addLLMNode]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    },
    [setNodes]
  );

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="bg-background p-4 rounded-lg shadow-lg">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Nodes</h3>
            <div
              className="p-2 border rounded-md cursor-move hover:bg-muted"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'llm');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              LLM Node
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}; 