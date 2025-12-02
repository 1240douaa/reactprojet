// Configuration centralisée de l'API Gateway
const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8090/api/gateway';
const GATEWAY_URL = "http://localhost:8090/api/gateway"; // ⬅️ Ajustez si différent

// Endpoints des services
export const API_ENDPOINTS = {
  STUDENTS: `${API_GATEWAY_URL}/students_service`,
  COURSES: `${API_GATEWAY_URL}/courses_service`,
  GRAPHQL: `${API_GATEWAY_URL}/graphql_service`,
  AI: `${API_GATEWAY_URL}/ai_service`,
  SERVICES: `${API_GATEWAY_URL}/services`
};

// Helper pour construire des URLs avec des IDs
export const buildURL = (baseURL, id = null, path = '') => {
  let url = baseURL;
  if (id) url += `/${id}`;
  if (path) url += path;
  return url;
};
export const getStudentCourses = async () => {
  const response = await fetch("http://localhost:8090/api/gateway/studentcourses_service/");
  if (!response.ok) throw new Error("Failed to fetch student courses");
  return response.json();
};
export const translateText = async (text) => {
  const response = await fetch(`${GATEWAY_URL}/ai_translate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Translation failed");
  }
  
  return response.json();
};
export const summarizeText = async (text, ratio = 0.3) => {
  const response = await fetch(`${GATEWAY_URL}/ai_summarize/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, ratio }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Summarization failed");
  }
  
  return response.json();
};

// Helper pour les requêtes API
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Si la réponse n'est pas OK, lever une erreur
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Essayer de parser le JSON
    const data = await response.json().catch(() => null);
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Helpers pour les opérations CRUD
export const apiGet = (url) => apiRequest(url, { method: 'GET' });

export const apiPost = (url, data) => 
  apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiPut = (url, data) =>
  apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const apiDelete = (url) =>
  apiRequest(url, { method: 'DELETE' });

export default API_ENDPOINTS;