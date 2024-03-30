export const officialAPIEndpoint = 'https://api.openai.com/v1/chat/completions';
const customAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || 'https://chatgpt-api.shn.hk/v1/';
export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || officialAPIEndpoint;

export const modelsEndpoint = 'https://api.openai.com/v1/models'; // Add the model endpoint here

export const availableEndpoints = [officialAPIEndpoint, customAPIEndpoint, modelsEndpoint]; // Include the model endpoint in availableEndpoints
