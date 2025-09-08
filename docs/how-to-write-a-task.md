# How to Write a Task

This guide explains how to create well-structured task files for the yeety-book project, following the incremental development methodology defined in `.clinerules`.

## Task Structure

Each task file should follow this exact template:

```markdown
# [Number] – [Title]

## Goal

[Clear, concise statement of what this task achieves]

## Deliverable

- [Specific, measurable output 1]
- [Specific, measurable output 2]
- [Additional concrete artifacts]

## Validation

- [How to verify the task is complete]
- [Specific commands to run (e.g., pnpm lint, pnpm build)]
- [Expected outcomes and behaviors]

## Accepted

- [ ] Task requirements reviewed and approved

## Done

- [ ] Task completed and validated
```

## Writing Guidelines

### 1. Task Numbering and Naming

- Use 3-digit numbering: `001-`, `002-`, etc.
- Use kebab-case for file names: `001-project-setup.md`
- Keep titles concise but descriptive

### 2. Goal Section

- Write a single, clear sentence explaining the purpose
- Focus on the **why** and **what** will be achieved
- Connect to the broader project objectives

### 3. Deliverable Section

- List concrete, measurable outputs
- Be specific about files, configurations, or features created
- Include technical details that matter for implementation
- Each bullet should represent something tangible

### 4. Validation Section

- Always include the three core validation commands:
  - `pnpm lint` → succeeds without errors
  - `pnpm typecheck` → passes TypeScript validation
  - `pnpm build` → builds successfully
- Add functional validation specific to the task
- Describe expected user-visible behavior
- Include testing steps that prove the feature works

### 5. Task Size and Scope

- Each task should be completable in **10-15 minutes maximum**
- Break large features into multiple smaller tasks
- Never combine setup, features, and UI in a single task
- Focus on one clear objective per task

## Best Practices

### ✅ Do

- Write tasks that can be validated independently
- Include specific commands and expected outputs
- Make deliverables measurable and concrete
- Follow the project's tech stack (Next.js, TypeScript, Prisma, etc.)
- Respect the multi-tenant architecture (restaurantSlug in URLs)

### ❌ Don't

- Create tasks that depend on future, undefined work
- Write vague deliverables like "improve the UI"
- Skip validation steps
- Combine multiple features in one task
- Implement features that aren't explicitly requested

## Example: Good vs Bad Tasks

### ❌ Bad Task

```markdown
# 015 – Add user management

## Goal
Make the app better for users

## Deliverable
- User stuff
- Better experience

## Validation
- It works
```

### ✅ Good Task

```markdown
# 015 – User profile page

## Goal
Enable authenticated users to view and edit their basic profile information in the dashboard.

## Deliverable
- `/dashboard/profile` page created with form
- User profile form with name, email fields
- Update API endpoint `PATCH /api/user/profile`
- Form validation using React Hook Form + Zod
- Success/error feedback messages

## Validation
- `pnpm lint`, `pnpm typecheck`, `pnpm build` all succeed
- Authenticated user can navigate to `/dashboard/profile`
- Form displays current user information
- Form submission updates user data in database
- Validation errors display for invalid inputs
```

## Task Dependencies

- Tasks should build incrementally on previous work
- Reference specific previous tasks when needed
- Ensure each task can be validated independently
- Don't assume future tasks will be completed

## Validation Commands Reference

Always include these core commands in validation:

```bash
pnpm lint          # ESLint passes
pnpm typecheck     # TypeScript validation
pnpm build         # Next.js build succeeds
```

Additional validation examples:

```bash
pnpm prisma migrate dev    # Database migrations
pnpm test                  # Run test suite
curl -X POST /api/...      # API endpoint testing
```

## Checklist for Task Quality

Before finalizing a task, verify:

- [ ] Goal is clear and specific
- [ ] Deliverables are concrete and measurable
- [ ] Validation includes the three core commands
- [ ] Task scope is 10-15 minutes maximum
- [ ] Technical details align with project stack
- [ ] Task can be completed independently
- [ ] Acceptance and completion checkboxes are included
