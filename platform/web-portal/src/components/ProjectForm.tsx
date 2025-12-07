'use client';

import { useState } from 'react';

const TECH_STACKS = [
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Python async REST API framework',
    icon: '🐍',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'fastapi-hexagonal',
    name: 'FastAPI Hexagonal',
    description: 'Python with Clean Architecture/DDD',
    icon: '🏛️',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Express.js REST API',
    icon: '🟢',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'go',
    name: 'Go',
    description: 'High-performance compiled API',
    icon: '🔵',
    color: 'bg-cyan-100 text-cyan-800',
  },
  {
    id: 'dotnet',
    name: '.NET',
    description: '.NET 8 Minimal API',
    icon: '🟣',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Cross-platform mobile/web',
    icon: '📱',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'reactnative',
    name: 'React Native',
    description: 'Mobile app with Expo',
    icon: '⚛️',
    color: 'bg-sky-100 text-sky-800',
  },
];

const ORGANIZATIONS = [
  { id: 'nl', name: 'NL', description: 'Netherlands' },
  { id: 'pvc', name: 'PVC', description: 'Phoenix VC' },
  { id: 'tws', name: 'TWS', description: 'The Web Shop' },
  { id: 'mys', name: 'MYS', description: 'My Service' },
];

const ENVIRONMENTS = [
  { id: 'dev', name: 'Development', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'staging', name: 'Staging', color: 'bg-blue-100 text-blue-800' },
  { id: 'prod', name: 'Production', color: 'bg-red-100 text-red-800' },
];

const REGIONS = [
  { id: 'euw', name: 'West Europe', flag: '🇪🇺' },
  { id: 'eus', name: 'East US', flag: '🇺🇸' },
  { id: 'wus', name: 'West US', flag: '🇺🇸' },
  { id: 'san', name: 'South Africa North', flag: '🇿🇦' },
  { id: 'saf', name: 'South Africa', flag: '🇿🇦' },
];

interface FormData {
  org: string;
  env: string;
  project: string;
  techstack: string;
  region: string;
  description: string;
  isPrivate: boolean;
}

export function ProjectForm() {
  const [formData, setFormData] = useState<FormData>({
    org: '',
    env: 'dev',
    project: '',
    techstack: '',
    region: 'euw',
    description: '',
    isPrivate: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Project created successfully!',
          url: data.url,
        });
        // Reset form
        setFormData({
          org: '',
          env: 'dev',
          project: '',
          techstack: '',
          region: 'euw',
          description: '',
          isPrivate: true,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create project',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    formData.org &&
    formData.env &&
    formData.project &&
    formData.techstack &&
    /^[a-z0-9]{2,20}$/.test(formData.project);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Result Message */}
      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.success ? (
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.message}
              </p>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-green-700 hover:text-green-900"
                >
                  Open Repository →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Organization */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Organization
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ORGANIZATIONS.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => setFormData({ ...formData, org: org.id })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.org === org.id
                  ? 'border-phoenix-500 bg-phoenix-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900">{org.name}</div>
              <div className="text-xs text-slate-500">{org.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Name */}
      <div>
        <label
          htmlFor="project"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Project Name
        </label>
        <input
          type="text"
          id="project"
          value={formData.project}
          onChange={(e) =>
            setFormData({ ...formData, project: e.target.value.toLowerCase() })
          }
          placeholder="my-awesome-api"
          pattern="[a-z0-9]{2,20}"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-phoenix-500 focus:border-phoenix-500 transition-colors"
        />
        <p className="mt-1 text-sm text-slate-500">
          2-20 lowercase alphanumeric characters
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tech Stack
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TECH_STACKS.map((stack) => (
            <button
              key={stack.id}
              type="button"
              onClick={() => setFormData({ ...formData, techstack: stack.id })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.techstack === stack.id
                  ? 'border-phoenix-500 bg-phoenix-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stack.icon}</span>
                <div>
                  <div className="font-semibold text-slate-900">{stack.name}</div>
                  <div className="text-xs text-slate-500">{stack.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Environment & Region */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Environment
          </label>
          <div className="space-y-2">
            {ENVIRONMENTS.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setFormData({ ...formData, env: env.id })}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  formData.env === env.id
                    ? 'border-phoenix-500 bg-phoenix-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${env.color}`}
                >
                  {env.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Azure Region
          </label>
          <div className="space-y-2">
            {REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => setFormData({ ...formData, region: region.id })}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  formData.region === region.id
                    ? 'border-phoenix-500 bg-phoenix-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="mr-2">{region.flag}</span>
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="A brief description of your project..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-phoenix-500 focus:border-phoenix-500 transition-colors"
        />
      </div>

      {/* Visibility */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="private"
          checked={formData.isPrivate}
          onChange={(e) =>
            setFormData({ ...formData, isPrivate: e.target.checked })
          }
          className="h-4 w-4 text-phoenix-600 focus:ring-phoenix-500 border-slate-300 rounded"
        />
        <label htmlFor="private" className="ml-2 text-sm text-slate-700">
          Private repository
        </label>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
            isValid && !isSubmitting
              ? 'bg-gradient-to-r from-phoenix-500 to-phoenix-600 hover:from-phoenix-600 hover:to-phoenix-700 shadow-lg shadow-phoenix-500/25'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Project...
            </span>
          ) : (
            'Create Project'
          )}
        </button>
      </div>

      {/* Preview */}
      {formData.org && formData.project && formData.techstack && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Preview</h3>
          <code className="text-sm text-phoenix-600">
            {formData.org}-{formData.env}-{formData.project}-{formData.techstack}
          </code>
          <p className="text-xs text-slate-500 mt-1">
            Resource Group: {formData.org}-{formData.env}-{formData.project}-rg-
            {formData.region}
          </p>
        </div>
      )}
    </form>
  );
}
