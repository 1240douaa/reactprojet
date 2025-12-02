import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, AlertCircle, CheckCircle, Users, BookOpen, UserPlus, Trash2, Plus } from 'lucide-react';
import './GraphQLService.css';

const GraphQLService = () => {
  // États pour les données
  const [inscriptions, setInscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour le modal d'inscription
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  // URLs des services
  const GATEWAY_URL = 'http://localhost:8090/api/gateway';
  const STUDENT_COURSES_URL = 'http://127.0.0.1:8000/api/studentcourses/';
  const STUDENTS_URL = 'https://student-1rpp.onrender.com/api/students';

  // Charger les données au démarrage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadInscriptions(),
      loadStudents(),
      loadCourses()
    ]);
  };

  // ==========================================
  // CHARGER LES INSCRIPTIONS
  // ==========================================
  const loadInscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Chargement des inscriptions depuis:', STUDENT_COURSES_URL);
      
      const response = await fetch(STUDENT_COURSES_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Inscriptions chargées:', data);
      
      setInscriptions(data);
    } catch (err) {
      console.error('❌ Erreur chargement inscriptions:', err);
      setError(`Erreur de chargement des inscriptions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHARGER LES ÉTUDIANTS (depuis Render)
  // ==========================================
  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      console.log('👥 Chargement des étudiants depuis:', STUDENTS_URL);
      
      const response = await fetch(STUDENTS_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Étudiants chargés:', data.length, 'étudiants');
      console.log('📋 Premier étudiant:', data[0]); // Debug pour voir la structure
      
      setStudents(data);
    } catch (err) {
      console.error('❌ Erreur chargement étudiants:', err);
      // Ne pas bloquer l'affichage si les étudiants Render ne sont pas disponibles
      console.warn('⚠️ Utilisation des IDs uniquement pour les étudiants');
    } finally {
      setStudentsLoading(false);
    }
  };

  // ==========================================
  // CHARGER LES COURS (via Gateway)
  // ==========================================
  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      console.log('📖 Chargement des cours via Gateway');
      
      const response = await fetch(`${GATEWAY_URL}/courses_service/`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Cours chargés:', data.length);
      
      setCourses(data);
    } catch (err) {
      console.error('❌ Erreur chargement cours:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  // ==========================================
  // INSCRIRE UN ÉTUDIANT À UN COURS
  // ==========================================
  const handleEnrollStudent = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      alert('Veuillez sélectionner un étudiant et un cours');
      return;
    }

    setEnrolling(true);
    try {
      const payload = {
        student_id: parseInt(selectedStudentId),
        course: parseInt(selectedCourseId)
      };
      
      console.log('📝 Inscription en cours...', payload);
      console.log('🔗 URL:', STUDENT_COURSES_URL);

      const response = await fetch(STUDENT_COURSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(errorText || `Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Inscription réussie:', data);

      // Recharger les inscriptions
      await loadInscriptions();
      
      // Fermer le modal et réinitialiser
      setShowEnrollModal(false);
      setSelectedStudentId('');
      setSelectedCourseId('');
      
      alert('✅ Étudiant inscrit avec succès !');
    } catch (err) {
      console.error('❌ Erreur inscription complète:', err);
      
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que:\n' +
                      '1. Le service Course est démarré (http://127.0.0.1:8000)\n' +
                      '2. CORS est activé dans Django\n' +
                      '3. Pas de bloqueur de contenu dans le navigateur';
      }
      
      alert(`❌ Erreur lors de l'inscription:\n${errorMessage}`);
    } finally {
      setEnrolling(false);
    }
  };

  // ==========================================
  // SUPPRIMER UNE INSCRIPTION
  // ==========================================
  const handleDeleteInscription = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      return;
    }

    try {
      console.log('🗑️ Suppression inscription ID:', id);

      const response = await fetch(`${STUDENT_COURSES_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      console.log('✅ Inscription supprimée');

      // Recharger les inscriptions
      await loadInscriptions();
      
      alert('✅ Inscription supprimée avec succès !');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  // ==========================================
  // FONCTIONS UTILITAIRES
  // ==========================================
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return `Étudiant #${studentId}`;
    
    // Gérer les différents formats possibles
    const firstName = student.first_name || student.firstName || '';
    const lastName = student.last_name || student.lastName || '';
    
    if (!firstName && !lastName) return `Étudiant #${studentId}`;
    
    return `${firstName} ${lastName}`.trim();
  };

  const getStudentEmail = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.email || '-';
  };
  
  const getStudentInitials = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 'ID';
    
    const firstName = student.first_name || student.firstName || '';
    const lastName = student.last_name || student.lastName || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : 'ID';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course #${courseId}`;
  };

  const getCourseInstructor = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.instructor : '-';
  };

  return (
    <div className="graphql-service">
      {/* Header */}
      <div className="service-header">
        <div className="service-title">
          <Database size={32} className="service-icon" />
          <div>
            <h2>Inscriptions (Student Courses)</h2>
            <p>Gestion des inscriptions étudiants-cours via la table student_courses</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={loadAllData} 
            className="btn btn-secondary"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Actualiser
          </button>
          <button 
            onClick={() => setShowEnrollModal(true)} 
            className="btn btn-primary"
            disabled={studentsLoading || coursesLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            Nouvelle Inscription
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Message de succès */}
      {!loading && !error && inscriptions.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          color: '#166534'
        }}>
          <CheckCircle size={20} />
          <span>{inscriptions.length} inscription(s) trouvée(s)</span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="stat-card">
          <Database size={24} style={{ color: '#2563eb' }} />
          <div>
            <p className="stat-value">{inscriptions.length}</p>
            <p className="stat-label">Total inscriptions</p>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} style={{ color: '#10b981' }} />
          <div>
            <p className="stat-value">
              {new Set(inscriptions.map(i => i.student_id)).size}
            </p>
            <p className="stat-label">Étudiants inscrits</p>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen size={24} style={{ color: '#7c3aed' }} />
          <div>
            <p className="stat-value">
              {new Set(inscriptions.map(i => i.course)).size}
            </p>
            <p className="stat-label">Cours actifs</p>
          </div>
        </div>
      </div>

      {/* Tableau des inscriptions */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            gap: '1rem'
          }}>
            <RefreshCw size={48} className="spinning" style={{ color: '#2563eb' }} />
            <p style={{ color: '#6b7280' }}>Chargement des inscriptions...</p>
          </div>
        ) : inscriptions.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            gap: '1rem'
          }}>
            <Database size={48} style={{ color: '#d1d5db' }} />
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Aucune inscription trouvée
            </p>
            <button 
              onClick={() => setShowEnrollModal(true)}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              <Plus size={20} />
              Créer une inscription
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                background: '#f9fafb',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Étudiant</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Cours</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Instructeur</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((inscription, index) => (
                  <tr 
                    key={inscription.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      background: index % 2 === 0 ? 'white' : '#fafafa',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafafa'}
                  >
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {inscription.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }}>
                          {getStudentInitials(inscription.student_id)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1f2937' }}>
                            {getStudentName(inscription.student_id)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            ID: {inscription.student_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {getStudentEmail(inscription.student_id)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#7c3aed'
                      }}>
                        <BookOpen size={16} />
                        {getCourseName(inscription.course)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {getCourseInstructor(inscription.course)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteInscription(inscription.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.target.style.background = '#fef2f2'}
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'inscription */}
      {showEnrollModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                Nouvelle Inscription
              </h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex'
                }}
              >
                <AlertCircle size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Sélection de l'étudiant */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  color: '#374151'
                }}>
                  Étudiant
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  disabled={studentsLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">
                    {studentsLoading ? 'Chargement...' : 'Sélectionnez un étudiant'}
                  </option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection du cours */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  color: '#374151'
                }}>
                  Cours
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={coursesLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">
                    {coursesLoading ? 'Chargement...' : 'Sélectionnez un cours'}
                  </option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.instructor}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '1.5rem'
            }}>
              <button
                onClick={handleEnrollStudent}
                disabled={enrolling || !selectedStudentId || !selectedCourseId}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  opacity: (enrolling || !selectedStudentId || !selectedCourseId) ? 0.5 : 1,
                  cursor: (enrolling || !selectedStudentId || !selectedCourseId) ? 'not-allowed' : 'pointer'
                }}
              >
                {enrolling ? (
                  <>
                    <RefreshCw size={20} className="spinning" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Inscrire
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLService;