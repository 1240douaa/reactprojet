import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';

const GatewayDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    gateway: { status: 'testing', message: 'Test en cours...' },
    students: { status: 'pending', message: 'En attente...' },
    courses: { status: 'pending', message: 'En attente...' },
    graphql: { status: 'pending', message: 'En attente...' },
    ai: { status: 'pending', message: 'En attente...' }
  });

  const testEndpoint = async (name, testFn) => {
    try {
      await testFn();
      return { status: 'success', message: 'Connecté ✅' };
    } catch (error) {
      return { 
        status: 'error', 
        message: `Erreur: ${error.message}` 
      };
    }
  };

  const runDiagnostics = async () => {
    console.log('🔍 Démarrage des diagnostics...');

    // Test Gateway
    const gatewayResult = await testEndpoint('gateway', () => 
      apiService.getServicesInfo()
    );
    setDiagnostics(prev => ({ ...prev, gateway: gatewayResult }));

    if (gatewayResult.status === 'success') {
      // Test Students Service
      const studentsResult = await testEndpoint('students', () => 
        apiService.getStudents()
      );
      setDiagnostics(prev => ({ ...prev, students: studentsResult }));

      // Test Courses Service
      const coursesResult = await testEndpoint('courses', () => 
        apiService.getCourses()
      );
      setDiagnostics(prev => ({ ...prev, courses: coursesResult }));

      // Test GraphQL Service
      const graphqlResult = await testEndpoint('graphql', () => 
        apiService.getEnrollments()
      );
      setDiagnostics(prev => ({ ...prev, graphql: graphqlResult }));

      // Test AI Service
      const aiResult = await testEndpoint('ai', () => 
        apiService.translateText('test', 'en', 'fr')
      );
      setDiagnostics(prev => ({ ...prev, ai: aiResult }));
    } else {
      setDiagnostics(prev => ({
        ...prev,
        students: { status: 'error', message: 'Gateway non disponible' },
        courses: { status: 'error', message: 'Gateway non disponible' },
        graphql: { status: 'error', message: 'Gateway non disponible' },
        ai: { status: 'error', message: 'Gateway non disponible' }
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <XCircle size={20} color="#ef4444" />;
      case 'testing':
        return <Activity size={20} color="#3b82f6" className="animate-pulse" />;
      default:
        return <AlertCircle size={20} color="#9ca3af" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#dcfce7';
      case 'error':
        return '#fee2e2';
      case 'testing':
        return '#dbeafe';
      default:
        return '#f3f4f6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '16px',
      minWidth: '320px',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          🔧 Diagnostic Gateway
        </h3>
        <button
          onClick={runDiagnostics}
          style={{
            padding: '4px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          Re-tester
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(diagnostics).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              background: getStatusColor(value.status),
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}
          >
            {getStatusIcon(value.status)}
            <div style={{ flex: 1 }}>
              <strong style={{ textTransform: 'capitalize' }}>{key}:</strong>
              <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                {value.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '12px',
        padding: '8px',
        background: '#f0f9ff',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#1e40af'
      }}>
        <strong>💡 URLs testées:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
          <li>Gateway: http://localhost:8090/api/gateway/services/</li>
          <li>Students: http://localhost:8090/api/gateway/students_service/</li>
          <li>Courses: http://localhost:8090/api/gateway/courses_service/</li>
        </ul>
      </div>
    </div>
  );
};

export default GatewayDiagnostic;