-- Simple Orchestra Database Schema
-- This migration creates the core tables for the Simple Orchestra platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE goal_status AS ENUM ('pending', 'in-progress', 'completed', 'blocked');
CREATE TYPE goal_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE workflow_status AS ENUM ('idle', 'running', 'completed', 'error');
CREATE TYPE workflow_complexity AS ENUM ('low', 'medium', 'high');
CREATE TYPE node_type AS ENUM ('agent', 'logic', 'io', 'human');
CREATE TYPE node_status AS ENUM ('idle', 'running', 'completed', 'error');
CREATE TYPE run_status AS ENUM ('running', 'completed', 'error', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Organization memberships
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'active',
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project collaborators
CREATE TABLE IF NOT EXISTS public.project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    added_at TIMESTAMPTZ DEFAULT NOW(),
    added_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    UNIQUE(project_id, user_id)
);

-- Goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status goal_status DEFAULT 'pending',
    priority goal_priority DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    trigger_config JSONB DEFAULT '{}',
    complexity workflow_complexity DEFAULT 'medium',
    status workflow_status DEFAULT 'idle',
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    is_template BOOLEAN DEFAULT false,
    success_rate NUMERIC(5,2) DEFAULT 0,
    avg_run_time INTERVAL,
    total_runs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    last_run_at TIMESTAMPTZ
);

-- Workflow nodes table
CREATE TABLE IF NOT EXISTS public.workflow_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
    type node_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position_x NUMERIC NOT NULL,
    position_y NUMERIC NOT NULL,
    config JSONB DEFAULT '{}',
    status node_status DEFAULT 'idle',
    agent_id TEXT,
    requires_approval BOOLEAN DEFAULT false,
    approval_assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approval_deadline TIMESTAMPTZ,
    execution_time INTERVAL,
    success_rate NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow connections table
CREATE TABLE IF NOT EXISTS public.workflow_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
    source_node_id UUID REFERENCES public.workflow_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES public.workflow_connections(id) ON DELETE CASCADE,
    label TEXT,
    condition_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow runs table
CREATE TABLE IF NOT EXISTS public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
    status run_status DEFAULT 'running',
    triggered_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    trigger_data JSONB DEFAULT '{}',
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    error_message TEXT,
    result_data JSONB DEFAULT '{}'
);

-- Node runs table (tracks individual node executions within workflow runs)
CREATE TABLE IF NOT EXISTS public.node_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_run_id UUID REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
    node_id UUID REFERENCES public.workflow_nodes(id) ON DELETE CASCADE,
    status run_status DEFAULT 'running',
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0
);

-- Approvals table
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_run_id UUID REFERENCES public.node_runs(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    deadline TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Taggable entities junction tables
CREATE TABLE IF NOT EXISTS public.project_tags (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.goal_tags (
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.workflow_tags (
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (workflow_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_tags ENABLE ROW LEVEL SECURITY;

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER workflows_updated_at BEFORE UPDATE ON public.workflows
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER workflow_nodes_updated_at BEFORE UPDATE ON public.workflow_nodes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();