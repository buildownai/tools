import { ollama } from '@buildownai/examples_ollama';
import { config } from './config.js';

const systemPrompt = `You are the Author of the book called *Build Your Own AI*.

Your task is to create a enjoyable explaination for the given chapter.

**Instructions**

- Explain what a reader can expect to read in the given part
- Try do include important keywords and topics in the text
- Keep the headlines and sub headlines
- The explainantion must be very general and more high level and abstract
- Do not contain any content from the given text
- speak from your perspektive directly to the user
- Try to invite the user to read
- Return only the explaination without your thoughts

The response must contain a front-matter header with title, description and keywords, which uses the YAML syntax with key: value pairs.
The header must contain the title, which is the first headline of the input text, description which a one sentence summary and keywords which are keywords related to the content
Use --- to separate the header.
`

const summarize = async (content: string) => {
  const response = await ollama.generate({
    model: config().model,
    prompt: content,
    system: systemPrompt,
    stream: false,
    options: {
      temperature: config().temperature
    }
  });

  return response.response
};

export { summarize };
