import Ajv, { ValidateFunction } from 'ajv';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv({ allErrors: true, strict: false });
const schemasDir = path.join(__dirname, 'schemas');

const validators: Record<string, ValidateFunction> = {};

function loadSchema(name: string) {
  const p = path.join(schemasDir, `${name}.schema.json`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

export function getValidator(name: string): ValidateFunction | null {
  if (validators[name]) return validators[name];
  const schema = loadSchema(name);
  if (!schema) return null;
  const v = ajv.compile(schema);
  validators[name] = v;
  return v;
}

export function validate(name: string, data: any) {
  const v = getValidator(name);
  if (!v) return { valid: false, errors: [{ message: `schema ${name} not found` }] };
  const ok = v(data);
  return { valid: Boolean(ok), errors: v.errors };
}
