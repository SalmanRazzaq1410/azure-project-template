import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  org: z.enum(['nl', 'pvc', 'tws', 'mys']),
  env: z.enum(['dev', 'staging', 'prod']),
  project: z.string().regex(/^[a-z0-9]{2,20}$/),
  techstack: z.enum([
    'fastapi',
    'fastapi-hexagonal',
    'nodejs',
    'go',
    'dotnet',
    'flutter',
    'reactnative',
  ]),
  region: z.enum(['euw', 'eus', 'wus', 'san', 'saf']).default('euw'),
  description: z.string().optional(),
  isPrivate: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = CreateProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { org, env, project, techstack, region, description, isPrivate } =
      validationResult.data;

    // Initialize Octokit with GitHub token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const octokit = new Octokit({ auth: token });

    const templateOwner = process.env.TEMPLATE_OWNER || 'phoenixvc';
    const templateRepo = process.env.TEMPLATE_REPO || 'azure-project-template';
    const targetOwner = process.env.TARGET_OWNER || 'phoenixvc';

    // Create repository from template
    const { data: repo } = await octokit.repos.createUsingTemplate({
      template_owner: templateOwner,
      template_repo: templateRepo,
      owner: targetOwner,
      name: project,
      description: description || `${org}-${env}-${project} (${techstack})`,
      private: isPrivate,
      include_all_branches: false,
    });

    console.log(`Repository created: ${repo.full_name}`);

    // Wait a moment for the repo to be fully created
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Trigger the initialization workflow
    try {
      await octokit.actions.createWorkflowDispatch({
        owner: targetOwner,
        repo: project,
        workflow_id: 'template-setup.yml',
        ref: repo.default_branch || 'main',
        inputs: {
          org,
          env,
          project,
          techstack,
          region,
        },
      });

      console.log('Workflow dispatch triggered');
    } catch (workflowError) {
      console.error('Failed to trigger workflow:', workflowError);
      // Don't fail the request - the workflow can be triggered manually
    }

    return NextResponse.json({
      success: true,
      url: repo.html_url,
      name: repo.name,
      full_name: repo.full_name,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);

    // Handle specific GitHub errors
    if (error.status === 422) {
      return NextResponse.json(
        { error: 'Repository name already exists or is invalid' },
        { status: 422 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'GitHub authentication failed' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
