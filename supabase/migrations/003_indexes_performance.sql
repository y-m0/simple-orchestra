-- Performance Indexes for Simple Orchestra Database

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_seen_at ON public.users(last_seen_at);

-- Organizations table indexes
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON public.organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON public.organizations USING gin(name gin_trgm_ops);

-- Organization members indexes
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON public.organization_members(role);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_organization_id ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_name ON public.projects USING gin(name gin_trgm_ops);

-- Project collaborators indexes
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_role ON public.project_collaborators(role);

-- Goals table indexes
CREATE INDEX IF NOT EXISTS idx_goals_project_id ON public.goals(project_id);
CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON public.goals(parent_goal_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON public.goals(priority);
CREATE INDEX IF NOT EXISTS idx_goals_due_date ON public.goals(due_date);
CREATE INDEX IF NOT EXISTS idx_goals_created_by ON public.goals(created_by);
CREATE INDEX IF NOT EXISTS idx_goals_title ON public.goals USING gin(title gin_trgm_ops);

-- Workflows table indexes
CREATE INDEX IF NOT EXISTS idx_workflows_project_id ON public.workflows(project_id);
CREATE INDEX IF NOT EXISTS idx_workflows_goal_id ON public.workflows(goal_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_complexity ON public.workflows(complexity);
CREATE INDEX IF NOT EXISTS idx_workflows_is_template ON public.workflows(is_template);
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON public.workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_workflows_last_run_at ON public.workflows(last_run_at);
CREATE INDEX IF NOT EXISTS idx_workflows_title ON public.workflows USING gin(title gin_trgm_ops);

-- Workflow nodes indexes
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_workflow_id ON public.workflow_nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_type ON public.workflow_nodes(type);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_status ON public.workflow_nodes(status);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_agent_id ON public.workflow_nodes(agent_id);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_requires_approval ON public.workflow_nodes(requires_approval);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_approval_assignee_id ON public.workflow_nodes(approval_assignee_id);

-- Workflow connections indexes
CREATE INDEX IF NOT EXISTS idx_workflow_connections_workflow_id ON public.workflow_connections(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_source_node_id ON public.workflow_connections(source_node_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_target_node_id ON public.workflow_connections(target_node_id);

-- Workflow runs indexes
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON public.workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON public.workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_triggered_by ON public.workflow_runs(triggered_by);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_start_time ON public.workflow_runs(start_time);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_end_time ON public.workflow_runs(end_time);

-- Node runs indexes
CREATE INDEX IF NOT EXISTS idx_node_runs_workflow_run_id ON public.node_runs(workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_node_runs_node_id ON public.node_runs(node_id);
CREATE INDEX IF NOT EXISTS idx_node_runs_status ON public.node_runs(status);
CREATE INDEX IF NOT EXISTS idx_node_runs_start_time ON public.node_runs(start_time);
CREATE INDEX IF NOT EXISTS idx_node_runs_end_time ON public.node_runs(end_time);

-- Approvals indexes
CREATE INDEX IF NOT EXISTS idx_approvals_node_run_id ON public.approvals(node_run_id);
CREATE INDEX IF NOT EXISTS idx_approvals_assignee_id ON public.approvals(assignee_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_deadline ON public.approvals(deadline);
CREATE INDEX IF NOT EXISTS idx_approvals_approved_by ON public.approvals(approved_by);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization_id ON public.activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id ON public.activity_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workflow_id ON public.activity_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON public.activity_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_name_trgm ON public.tags USING gin(name gin_trgm_ops);

-- Tag junction table indexes
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON public.project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_id ON public.project_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_goal_tags_goal_id ON public.goal_tags(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_tags_tag_id ON public.goal_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_workflow_tags_workflow_id ON public.workflow_tags(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tags_tag_id ON public.workflow_tags(tag_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_projects_org_status ON public.projects(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_project_status ON public.goals(project_id, status);
CREATE INDEX IF NOT EXISTS idx_workflows_project_status ON public.workflows(project_id, status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_status ON public.workflow_runs(workflow_id, status);
CREATE INDEX IF NOT EXISTS idx_node_runs_run_status ON public.node_runs(workflow_run_id, status);
CREATE INDEX IF NOT EXISTS idx_approvals_assignee_status ON public.approvals(assignee_id, status);

-- Time-based indexes for analytics
CREATE INDEX IF NOT EXISTS idx_workflow_runs_start_time_status ON public.workflow_runs(start_time, status);
CREATE INDEX IF NOT EXISTS idx_node_runs_start_time_status ON public.node_runs(start_time, status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at_action ON public.activity_logs(created_at, action);

-- JSONB indexes for configuration and metadata
CREATE INDEX IF NOT EXISTS idx_users_preferences ON public.users USING gin(preferences);
CREATE INDEX IF NOT EXISTS idx_organizations_settings ON public.organizations USING gin(settings);
CREATE INDEX IF NOT EXISTS idx_projects_settings ON public.projects USING gin(settings);
CREATE INDEX IF NOT EXISTS idx_workflows_trigger_config ON public.workflows USING gin(trigger_config);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_config ON public.workflow_nodes USING gin(config);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_condition_config ON public.workflow_connections USING gin(condition_config);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_trigger_data ON public.workflow_runs USING gin(trigger_data);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_result_data ON public.workflow_runs USING gin(result_data);
CREATE INDEX IF NOT EXISTS idx_node_runs_input_data ON public.node_runs USING gin(input_data);
CREATE INDEX IF NOT EXISTS idx_node_runs_output_data ON public.node_runs USING gin(output_data);
CREATE INDEX IF NOT EXISTS idx_activity_logs_metadata ON public.activity_logs USING gin(metadata);