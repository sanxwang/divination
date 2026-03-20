/**
 * Server-side Configuration Module
 * Re-exports the unified config from /config/index.js
 * 
 * This allows the server to use the same configuration as the web and config projects
 */

// Dynamically import the config module (ES6 modules)
// Since config/index.js uses ES6 export syntax, we need to use dynamic import or require

import fs from 'fs';
import path from 'path';

const configDir = path.join(__dirname, '..', 'config');

// Helper function to load config data
function loadConfigData() {
  // For now, keep using the original JSON file loading for compatibility
  // In the future, this could be replaced with dynamic import from config/index.js
  
  const promptsDir = path.join(__dirname, 'prompts');
  const schemasDir = path.join(__dirname, 'schemas');

  // Load all prompts
  const prompts: Record<string, any> = {};
  const promptFiles = fs.readdirSync(promptsDir).filter(f => f.endsWith('.json'));
  promptFiles.forEach(file => {
    const name = file.replace('.json', '');
    prompts[name] = JSON.parse(
      fs.readFileSync(path.join(promptsDir, file), 'utf-8')
    );
  });

  // Load all schemas
  const schemas: Record<string, any> = {};
  const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));
  schemaFiles.forEach(file => {
    const name = file.replace('.json', '');
    schemas[name] = JSON.parse(
      fs.readFileSync(path.join(schemasDir, file), 'utf-8')
    );
  });

  return { prompts, schemas };
}

const { prompts, schemas } = loadConfigData();

export function getPrompt(type: string): any {
  return prompts[type];
}

export function getSchema(type: string): any {
  return schemas[type];
}

export function getPromptKeys(): string[] {
  return Object.keys(prompts);
}

export function getSchemaKeys(): string[] {
  return Object.keys(schemas);
}

export { prompts, schemas };
