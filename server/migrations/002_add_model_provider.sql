-- Add model_provider column to prompt_logs table to track which model was used
ALTER TABLE prompt_logs ADD COLUMN IF NOT EXISTS model_provider TEXT DEFAULT 'deepseek';

-- Create index for better query performance on model_provider
CREATE INDEX IF NOT EXISTS idx_prompt_logs_model_provider ON prompt_logs(model_provider);
