// Service API centralisé pour communiquer avec le Gateway
// Compatible avec votre configuration GitHub (api/views.py et api/urls.py)

const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || 'http://localhost:8090/api/gateway';

class ApiService {
  constructor() {
    this.baseUrl = GATEWAY_URL;
    this.timeout = 15000; // 15 secondes
  }

  // ==========================================
  // MÉTHODE REQUEST GÉNÉRIQUE
  // ==========================================
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 [ApiService] ${options.method || 'GET'} ${url}`);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`✅ [ApiService] Response ${response.status} from ${url}`);
      
      // Gérer le cas 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      // Tenter de parser la réponse JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('⚠️ [ApiService] Non-JSON response:', text.substring(0, 200));
        throw new Error(`Invalid response format from server`);
      }
      
      // Gérer les erreurs HTTP
      if (!response.ok) {
        const errorMessage = data.error || data.message || data.detail || `HTTP Error ${response.status}`;
        console.error('❌ [ApiService] Error:', errorMessage, data);
        throw new Error(errorMessage);
      }
      
      console.log('✅ [ApiService] Data received successfully');
      return data;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`⏱️ [ApiService] Request timeout for ${url}`);
        throw new Error('La requête a pris trop de temps (timeout)');
      }
      
      console.error(`❌ [ApiService] Request failed for ${url}:`, error);
      throw error;
    }
  }

  // ==========================================
  // STUDENTS SERVICE via Gateway
  // Route Gateway: /api/gateway/students_service/
  // ==========================================
  
  async getStudents() {
    console.log('📚 [Students] Fetching all students...');
    return this.request('/students_service/');
  }

  async getStudent(id) {
    console.log(`📚 [Students] Fetching student ID: ${id}`);
    return this.request(`/students_service/${id}/`);
  }

  async createStudent(studentData) {
    console.log('📚 [Students] Creating new student:', studentData);
    return this.request('/students_service/', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id, studentData) {
    console.log(`📚 [Students] Updating student ID ${id}:`, studentData);
    return this.request(`/students_service/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id) {
    console.log(`📚 [Students] Deleting student ID: ${id}`);
    return this.request(`/students_service/${id}/`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // COURSES SERVICE via Gateway
  // Route Gateway: /api/gateway/courses_service/
  // ==========================================
  
  async getCourses() {
    console.log('📖 [Courses] Fetching all courses...');
    return this.request('/courses_service/');
  }

  async getCourse(id) {
    console.log(`📖 [Courses] Fetching course ID: ${id}`);
    return this.request(`/courses_service/${id}/`);
  }

  async createCourse(courseData) {
    console.log('📖 [Courses] Creating new course:', courseData);
    return this.request('/courses_service/', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    console.log(`📖 [Courses] Updating course ID ${id}:`, courseData);
    return this.request(`/courses_service/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    console.log(`📖 [Courses] Deleting course ID: ${id}`);
    return this.request(`/courses_service/${id}/`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // STUDENTCOURSES SERVICE via Gateway
  // Route Gateway: /api/gateway/studentcourses_service/
  // ==========================================
  
  async getStudentCourses() {
    console.log('🔗 [StudentCourses] Fetching all student-course links...');
    return this.request('/studentcourses_service/');
  }

  // ⬇️ AJOUT : Fonction pour récupérer les inscriptions (alias)
  async getInscriptions() {
    console.log('📝 [Inscriptions] Fetching all inscriptions...');
    return this.getStudentCourses();
  }

  // ==========================================
  // GRAPHQL SERVICE via Gateway
  // Route Gateway: /api/gateway/graphql_service/
  // Votre views.py utilise proxy_graphql avec @csrf_exempt
  // ==========================================
  
  async graphqlQuery(query, variables = {}) {
    console.log('🔍 [GraphQL] Executing query:', query.substring(0, 100) + '...');
    return this.request('/graphql_service/', {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    });
  }

  async getEnrollments() {
    console.log('🎓 [GraphQL] Fetching all enrollments...');
    const query = `
      query {
        allStudentCourses {
          id
          student {
            id
            name
          }
          course {
            id
            title
          }
        }
      }
    `;
    
    try {
      const response = await this.graphqlQuery(query);
      return response.data || response;
    } catch (error) {
      console.error('❌ [GraphQL] Failed to fetch enrollments:', error);
      throw error;
    }
  }

  async enrollStudent(studentId, courseId) {
    console.log(`🎓 [GraphQL] Enrolling student ${studentId} in course ${courseId}`);
    const query = `
      mutation {
        enroll(studentId: ${studentId}, courseId: ${courseId}) {
          id
          student {
            id
            name
          }
          course {
            id
            title
          }
        }
      }
    `;
    
    try {
      const response = await this.graphqlQuery(query);
      return response.data || response;
    } catch (error) {
      console.error('❌ [GraphQL] Failed to enroll student:', error);
      throw error;
    }
  }

  async removeEnrollment(enrollmentId) {
    console.log(`🎓 [GraphQL] Removing enrollment ID: ${enrollmentId}`);
    const query = `
      mutation {
        removeEnrollment(id: ${enrollmentId})
      }
    `;
    
    try {
      const response = await this.graphqlQuery(query);
      return response.data || response;
    } catch (error) {
      console.error('❌ [GraphQL] Failed to remove enrollment:', error);
      throw error;
    }
  }

  // ==========================================
  // AI SERVICE - APPEL DIRECT (sans gateway)
  // URL directe: http://localhost:8003/api/ai/
  // ==========================================
  
  async translateText(text) {
    console.log(`🌐 [AI] Translating text (EN -> FR)...`);
    
    // Appel DIRECT au service AI sur le port 8003
    const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8003/api/ai';
    
    try {
      const response = await fetch(`${AI_SERVICE_URL}/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log(`✅ [AI] Translation response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Translation failed');
      }

      const data = await response.json();
      console.log(`✅ [AI] Translation successful:`, data);
      return data;
      
    } catch (error) {
      console.error('❌ [AI] Translation error:', error);
      throw error;
    }
  }

  async summarizeText(text, ratio = 0.3) {
    console.log('📝 [AI] Summarizing text...');
    
    // Appel DIRECT au service AI sur le port 8003
    const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8003/api/ai';
    
    try {
      const response = await fetch(`${AI_SERVICE_URL}/summarize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, ratio }),
      });

      console.log(`✅ [AI] Summarization response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Summarization failed');
      }

      const data = await response.json();
      console.log(`✅ [AI] Summarization successful:`, data);
      return data;
      
    } catch (error) {
      console.error('❌ [AI] Summarization error:', error);
      throw error;
    }
  }

  // ==========================================
  // SERVICES INFO
  // Route Gateway: /api/gateway/services/
  // ==========================================
  
  async getServicesInfo() {
    console.log('ℹ️ [Services] Fetching services configuration...');
    return this.request('/services/');
  }

  // ==========================================
  // HEALTH CHECK
  // ==========================================
  
  async healthCheck() {
    console.log('🏥 [Health] Running health check...');
    try {
      const services = await this.getServicesInfo();
      console.log('✅ [Health] Gateway is healthy. Services:', Object.keys(services));
      return { 
        healthy: true, 
        services,
        gateway_url: this.baseUrl
      };
    } catch (error) {
      console.error('❌ [Health] Gateway health check failed:', error);
      return { 
        healthy: false, 
        error: error.message,
        gateway_url: this.baseUrl
      };
    }
  }

  // ==========================================
  // UTILITY: Test de connexion
  // ==========================================
  
  async testConnection() {
    console.log('🧪 [Test] Testing gateway connection...');
    console.log('🧪 [Test] Gateway URL:', this.baseUrl);
    
    try {
      // Test 1: Gateway accessible
      console.log('🧪 [Test 1/4] Testing gateway services endpoint...');
      const services = await this.getServicesInfo();
      console.log('✅ [Test 1/4] Gateway services OK:', Object.keys(services));

      // Test 2: Students service
      console.log('🧪 [Test 2/4] Testing students service...');
      const students = await this.getStudents();
      console.log('✅ [Test 2/4] Students service OK, count:', students.length || 0);

      // Test 3: Courses service
      console.log('🧪 [Test 3/4] Testing courses service...');
      const courses = await this.getCourses();
      console.log('✅ [Test 3/4] Courses service OK, count:', courses.length || 0);

      // Test 4: GraphQL service
      console.log('🧪 [Test 4/4] Testing GraphQL service...');
      const enrollments = await this.getEnrollments();
      console.log('✅ [Test 4/4] GraphQL service OK');

      return {
        success: true,
        results: {
          gateway: '✅ Connected',
          students: `✅ ${students.length || 0} students`,
          courses: `✅ ${courses.length || 0} courses`,
          graphql: '✅ Connected'
        }
      };

    } catch (error) {
      console.error('❌ [Test] Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        gateway_url: this.baseUrl
      };
    }
  }
}

// Export une instance unique (Singleton)
const apiService = new ApiService();

// Auto-test au chargement (en développement)
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 [ApiService] Initialized with Gateway URL:', apiService.baseUrl);
  
  // Test automatique après 2 secondes
  setTimeout(() => {
    apiService.healthCheck().then(result => {
      if (result.healthy) {
        console.log('✅ [ApiService] Gateway is healthy and ready!');
      } else {
        console.warn('⚠️ [ApiService] Gateway health check failed:', result.error);
        console.warn('💡 [ApiService] Make sure the gateway is running on:', result.gateway_url);
      }
    });
  }, 2000);
}

export default apiService;