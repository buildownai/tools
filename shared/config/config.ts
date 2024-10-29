// general configuration
export const config = () => ({
  ollama: {
    host: 'http://localhost:11434'
  },
  embeddingModel: 'nomic-embed-text',
  model: 'buildownai/qwen14b:latest',
  temperature: 0,
});
