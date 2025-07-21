-- Row Level Security Policies for Simple Orchestra

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other users in same organization" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om1
            JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
            WHERE om1.user_id = auth.uid() AND om2.user_id = public.users.id
        )
    );

-- Organizations table policies
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.organizations.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can update organization" ON public.organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.organizations.id 
            AND user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Authenticated users can create organizations" ON public.organizations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Organization members table policies
CREATE POLICY "Users can view members of their organizations" ON public.organization_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = public.organization_members.organization_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage members" ON public.organization_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = public.organization_members.organization_id 
            AND om.user_id = auth.uid() 
            AND om.role = 'admin'
        )
    );

-- Projects table policies
CREATE POLICY "Users can view projects in their organizations" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.projects.organization_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Project owners and admins can update projects" ON public.projects
    FOR UPDATE USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.projects.organization_id 
            AND user_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Organization members can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.projects.organization_id 
            AND user_id = auth.uid()
        )
    );

-- Project collaborators table policies
CREATE POLICY "Users can view collaborators of accessible projects" ON public.project_collaborators
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.project_collaborators.project_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage collaborators" ON public.project_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = public.project_collaborators.project_id 
            AND owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.project_collaborators.project_id 
            AND om.user_id = auth.uid() 
            AND om.role = 'admin'
        )
    );

-- Goals table policies
CREATE POLICY "Users can view goals in accessible projects" ON public.goals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.goals.project_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Project collaborators can manage goals" ON public.goals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.id = public.goals.project_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.goals.project_id 
            AND om.user_id = auth.uid() 
            AND om.role IN ('admin', 'user')
        )
    );

-- Workflows table policies
CREATE POLICY "Users can view workflows in accessible projects" ON public.workflows
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.workflows.project_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Project collaborators can manage workflows" ON public.workflows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.id = public.workflows.project_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.workflows.project_id 
            AND om.user_id = auth.uid() 
            AND om.role IN ('admin', 'user')
        )
    );

-- Workflow nodes table policies
CREATE POLICY "Users can view workflow nodes in accessible workflows" ON public.workflow_nodes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE w.id = public.workflow_nodes.workflow_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Workflow editors can manage nodes" ON public.workflow_nodes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE w.id = public.workflow_nodes.workflow_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid() OR w.created_by = auth.uid())
        )
    );

-- Workflow connections table policies
CREATE POLICY "Users can view workflow connections in accessible workflows" ON public.workflow_connections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE w.id = public.workflow_connections.workflow_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Workflow editors can manage connections" ON public.workflow_connections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE w.id = public.workflow_connections.workflow_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid() OR w.created_by = auth.uid())
        )
    );

-- Workflow runs table policies
CREATE POLICY "Users can view workflow runs in accessible workflows" ON public.workflow_runs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE w.id = public.workflow_runs.workflow_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Workflow executors can create runs" ON public.workflow_runs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE w.id = public.workflow_runs.workflow_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
        )
    );

-- Node runs table policies
CREATE POLICY "Users can view node runs in accessible workflow runs" ON public.node_runs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflow_runs wr
            JOIN public.workflows w ON wr.workflow_id = w.id
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE wr.id = public.node_runs.workflow_run_id 
            AND om.user_id = auth.uid()
        )
    );

-- Approvals table policies
CREATE POLICY "Users can view approvals assigned to them" ON public.approvals
    FOR SELECT USING (assignee_id = auth.uid());

CREATE POLICY "Assignees can update their approvals" ON public.approvals
    FOR UPDATE USING (assignee_id = auth.uid());

CREATE POLICY "Users can view approvals in accessible workflows" ON public.approvals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.node_runs nr
            JOIN public.workflow_runs wr ON nr.workflow_run_id = wr.id
            JOIN public.workflows w ON wr.workflow_id = w.id
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE nr.id = public.approvals.node_run_id 
            AND om.user_id = auth.uid()
        )
    );

-- Activity logs table policies
CREATE POLICY "Users can view activity logs in their organizations" ON public.activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = public.activity_logs.organization_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Tags table policies
CREATE POLICY "Users can view all tags" ON public.tags
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create tags" ON public.tags
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Tag junction table policies
CREATE POLICY "Users can view project tags for accessible projects" ON public.project_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE p.id = public.project_tags.project_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Project collaborators can manage project tags" ON public.project_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE p.id = public.project_tags.project_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can view goal tags for accessible goals" ON public.goal_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.goals g
            JOIN public.projects p ON g.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE g.id = public.goal_tags.goal_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Project collaborators can manage goal tags" ON public.goal_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.goals g
            JOIN public.projects p ON g.project_id = p.id
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE g.id = public.goal_tags.goal_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can view workflow tags for accessible workflows" ON public.workflow_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            JOIN public.organization_members om ON p.organization_id = om.organization_id
            WHERE w.id = public.workflow_tags.workflow_id 
            AND om.user_id = auth.uid()
        )
    );

CREATE POLICY "Workflow editors can manage workflow tags" ON public.workflow_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workflows w
            JOIN public.projects p ON w.project_id = p.id
            LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
            WHERE w.id = public.workflow_tags.workflow_id 
            AND (p.owner_id = auth.uid() OR pc.user_id = auth.uid() OR w.created_by = auth.uid())
        )
    );