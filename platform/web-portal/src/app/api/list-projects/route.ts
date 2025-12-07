import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const octokit = new Octokit({ auth: token });
    const owner = process.env.TARGET_OWNER || 'phoenixvc';

    // List repositories for the organization/user
    const { data: repos } = await octokit.repos.listForOrg({
      org: owner,
      type: 'all',
      sort: 'created',
      direction: 'desc',
      per_page: 50,
    });

    // Filter to only include repos created from the template (optional)
    // You could add a topic or label to identify template-based repos
    const projects = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      created_at: repo.created_at,
      language: repo.language,
      private: repo.private,
    }));

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Error listing projects:', error);

    // Try user repos if org fails
    if (error.status === 404) {
      try {
        const token = process.env.GITHUB_TOKEN;
        const octokit = new Octokit({ auth: token });
        const owner = process.env.TARGET_OWNER || 'phoenixvc';

        const { data: repos } = await octokit.repos.listForUser({
          username: owner,
          type: 'all',
          sort: 'created',
          direction: 'desc',
          per_page: 50,
        });

        const projects = repos.map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          created_at: repo.created_at,
          language: repo.language,
          private: repo.private,
        }));

        return NextResponse.json({ projects });
      } catch (userError) {
        return NextResponse.json(
          { error: 'Failed to list projects' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to list projects' },
      { status: 500 }
    );
  }
}
