
import { renderHook, act } from '@testing-library/react';
import { ProjectProvider, useProject } from '../ProjectContext';
import type { Project, Goal } from '@/types/project';

describe('ProjectContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProjectProvider>{children}</ProjectProvider>
  );

  it('should create a new project', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    act(() => {
      const newProject = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      expect(newProject).toHaveProperty('id');
      expect(newProject.name).toBe('Test Project');
      expect(newProject.goals).toHaveLength(0);
      expect(newProject).toHaveProperty('createdAt');
      expect(newProject).toHaveProperty('updatedAt');
    });

    expect(result.current.projects).toHaveLength(1);
  });

  it('should update a project', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.updateProject({
        ...project,
        name: 'Updated Project',
      });
    });

    expect(result.current.projects[0].name).toBe('Updated Project');
  });

  it('should delete a project', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.deleteProject(project.id);
    });

    expect(result.current.projects).toHaveLength(0);
  });

  it('should add a goal to a project', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    let goal: Goal;
    act(() => {
      goal = result.current.addGoal(project.id, {
        title: 'Test Goal',
        description: 'A test goal',
        status: 'pending',
        priority: 'medium',
        dueDate: undefined,
        workflowId: undefined,
        parentGoalId: undefined,
        tags: [],
        createdAt: new Date().toISOString(), // Added the missing createdAt property
      });

      expect(goal).toHaveProperty('id');
      expect(goal.title).toBe('Test Goal');
      expect(goal).toHaveProperty('createdAt');
    });

    expect(result.current.projects[0].goals).toHaveLength(1);
  });

  it('should update a goal', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    let goal: Goal;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      goal = result.current.addGoal(project.id, {
        title: 'Test Goal',
        description: 'A test goal',
        status: 'pending',
        priority: 'medium',
        dueDate: undefined,
        workflowId: undefined,
        parentGoalId: undefined,
        tags: [],
        createdAt: new Date().toISOString(), // Added the missing createdAt property
      });
    });

    act(() => {
      result.current.updateGoal(project.id, {
        ...goal,
        status: 'completed',
      });
    });

    expect(result.current.projects[0].goals[0].status).toBe('completed');
  });

  it('should delete a goal', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    let goal: Goal;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      goal = result.current.addGoal(project.id, {
        title: 'Test Goal',
        description: 'A test goal',
        status: 'pending',
        priority: 'medium',
        dueDate: undefined,
        workflowId: undefined,
        parentGoalId: undefined,
        tags: [],
        createdAt: new Date().toISOString(), // Added the missing createdAt property
      });
    });

    act(() => {
      result.current.deleteGoal(project.id, goal.id);
    });

    expect(result.current.projects[0].goals).toHaveLength(0);
  });

  it('should handle project selection', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    let project: Project;
    act(() => {
      project = result.current.createProject({
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        owner: 'test-owner',
        collaborators: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.setSelectedProject(project);
    });

    expect(result.current.selectedProject).toBe(project);

    act(() => {
      result.current.setSelectedProject(null);
    });

    expect(result.current.selectedProject).toBeNull();
  });
});
