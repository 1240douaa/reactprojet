import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Database, Users, BookOpen, UserCheck } from 'lucide-react';

const GraphQLService = () => {
  // Données statiques
  const staticStudents = [
    { id: 1, first_name: 'Ahmed', last_name: 'Benali' },
    { id: 2, first_name: 'Fatima', last_name: 'Zahra' },
    { id: 3, first_name: 'Yacine', last_name: 'Kaddour' },
    { id: 4, first_name: 'Amina', last_name: 'Messaoudi' },
    { id: 5, first_name: 'Karim', last_name: 'Boudiaf' },
    { id: 6, first_name: 'Samira', last_name: 'Hamdi' }
  ];

  const staticCourses = [
    { id: 1, name: 'Machine Learning Avancé', instructor: 'Dr. Amina Khelifa' },
    { id: 2, name: 'Big Data et Analytics', instructor: 'Prof. Karim Bencheikh' },
    { id: 3, name: 'Deep Learning', instructor: 'Dr. Fatima Bouaziz' },
    { id: 4, name: 'Traitement du Langage Naturel', instructor: 'Prof. Yacine Mansouri' },
    { id: 5, name: 'Systèmes Distribués', instructor: 'Dr. Samira Hadj' },
    { id: 6, name: 'Visualisation de Données', instructor: 'Prof. Ahmed Meziane' }
  ];

  const staticEnrollments = [
    {
      id: 1,
      student: { id: 1, name: 'Ahmed Benali' },
      course: { id: 1, title: 'Machine Learning Avancé' }
    },
    {
      id: 2,
      student: { id: 2, name: 'Fatima Zahra' },
      course: { id: 2, title: 'Big Data et Analytics' }
    },
    {
      id: 3,
      student: { id: 3, name: 'Yacine Kaddour' },
      course: { id: 3, title: 'Deep Learning' }
    },
    {
      id: 4,
      student: { id: 1, name: 'Ahmed Benali' },
      course: { id: 4, title: 'Traitement du Langage Naturel' }
    },
    {
      id: 5,
      student: { id: 4, name: 'Amina Messaoudi' },
      course: { id: 1, title: 'Machine Learning Avancé' }
    },
    {
      id: 6,
      student: { id: 5, name: 'Karim Boudiaf' },
      course: { id: 5, title: 'Systèmes Distribués' }
    }
  ];

  const [enrollments, setEnrollments] = useState(staticEnrollments);
  const [students, setStudents] = useState(staticStudents);
  const [courses, setCourses] = useState(staticCourses);
  const [filteredEnrollments, setFilteredEnrollments] = useState(staticEnrollments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  const GRAPHQL_URL = 'http://localhost:8090/gateway/graphql_service';

  useEffect(() => {
    fetchEnrollments();
    fetchStudentsAndCourses();
  }, []);

  useEffect(() => {
    const filtered = enrollments.filter(enrollment =>
      enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnrollments(filtered);
  }, [searchTerm, enrollments]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query {
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
          }`
        })
      });
      const data = await response.json();
      if (data.data?.allStudentCourses && data.data.allStudentCourses.length > 0) {
        setEnrollments(data.data.allStudentCourses);
        setFilteredEnrollments(data.data.allStudentCourses);
      } else {
        setEnrollments(staticEnrollments);
        setFilteredEnrollments(staticEnrollments);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      setEnrollments(staticEnrollments);
      setFilteredEnrollments(staticEnrollments);
    }
    setLoading(false);
  };

  const fetchStudentsAndCourses = async () => {
    try {
      const studentsResponse = await fetch('http://localhost:8090/gateway/students_service');
      const studentsData = await studentsResponse.json();
      if (studentsData && studentsData.length > 0) {
        setStudents(studentsData);
      } else {
        setStudents(staticStudents);
      }

      const coursesResponse = await fetch('http://localhost:8090/gateway/courses_service');
      const coursesData = await coursesResponse.json();
      if (coursesData && coursesData.length > 0) {
        setCourses(coursesData);
      } else {
        setCourses(staticCourses);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setStudents(staticStudents);
      setCourses(staticCourses);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) return;

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation {
            enroll(studentId: ${selectedStudent}, courseId: ${selectedCourse}) {
              id
            }
          }`
        })
      });
      if (response.ok) {
        fetchEnrollments();
        setShowEnrollModal(false);
        setSelectedStudent('');
        setSelectedCourse('');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      // Mode statique
      const student = students.find(s => s.id === parseInt(selectedStudent));
      const course = courses.find(c => c.id === parseInt(selectedCourse));
      const newEnrollment = {
        id: enrollments.length + 1,
        student: { id: student.id, name: `${student.first_name} ${student.last_name}` },
        course: { id: course.id, title: course.name }
      };
      setEnrollments([...enrollments, newEnrollment]);
      setShowEnrollModal(false);
      setSelectedStudent('');
      setSelectedCourse('');
    }
  };

  const handleRemoveEnrollment = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
      try {
        const response = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `mutation {
              removeEnrollment(id: ${id})
            }`
          })
        });
        if (response.ok) {
          fetchEnrollments();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setEnrollments(enrollments.filter(e => e.id !== id));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Image */}
      <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <img 
          src="https://i.pinimg.com/1200x/21/10/8e/21108e7b2a6228d26182b7d5792f93d9.jpg"
          alt="GraphQL"
          style={{ width: '100%', height: '256px', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(157, 23, 77, 0.9), rgba(225, 29, 72, 0.7))', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>Gestion des Inscriptions</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', margin: 0 }}>Système GraphQL pour inscriptions étudiant-cours</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Total Inscriptions</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{enrollments.length}</p>
            </div>
            <div style={{ background: 'linear-gradient(to bottom right, #ec4899, #db2777)', padding: '12px', borderRadius: '8px' }}>
              <Database size={24} color="white" />
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Étudiants Inscrits</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{students.length}</p>
            </div>
            <div style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)', padding: '12px', borderRadius: '8px' }}>
              <Users size={24} color="white" />
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Cours Disponibles</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: '0.5rem 0 0 0' }}>{courses.length}</p>
            </div>
            <div style={{ background: 'linear-gradient(to bottom right, #a855f7, #9333ea)', padding: '12px', borderRadius: '8px' }}>
              <BookOpen size={24} color="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input
              type="text"
              placeholder="Rechercher par étudiant ou cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            style={{ background: 'linear-gradient(to right, #ec4899, #db2777)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <Plus size={20} />
            <span>Nouvelle Inscription</span>
          </button>
        </div>
      </div>

      {/* Enrollments Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #ec4899', borderRadius: '50%', width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '3rem', textAlign: 'center' }}>
          <UserCheck size={64} color="#d1d5db" />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginTop: '1rem' }}>Aucune inscription trouvée</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'linear-gradient(to right, #ec4899, #db2777)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Étudiant</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>ID Étudiant</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Cours</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>ID Cours</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem 1.5rem', color: '#1f2937', fontWeight: 500 }}>{enrollment.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                          {enrollment.student?.name?.charAt(0) || '?'}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1f2937' }}>{enrollment.student?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{enrollment.student?.id || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'linear-gradient(to bottom right, #a855f7, #9333ea)', padding: '8px', borderRadius: '8px' }}>
                          <BookOpen size={20} color="white" />
                        </div>
                        <span style={{ fontWeight: 600, color: '#1f2937' }}>{enrollment.course?.title || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{enrollment.course?.id || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveEnrollment(enrollment.id)}
                        style={{ background: '#fef2f2', color: '#dc2626', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Trash2 size={16} />
                        <span>Annuler</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Nouvelle Inscription</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Sélectionner un Étudiant
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                >
                  <option value="">-- Choisir un étudiant --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} (ID: {student.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Sélectionner un Cours
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }}
                >
                  <option value="">-- Choisir un cours --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.instructor} (ID: {course.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleEnroll}
                disabled={!selectedStudent || !selectedCourse}
                style={{ flex: 1, background: 'linear-gradient(to right, #ec4899, #db2777)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: (!selectedStudent || !selectedCourse) ? 0.5 : 1 }}
              >
                Inscrire
              </button>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudent('');
                  setSelectedCourse('');
                }}
                style={{ flex: 1, background: '#e5e7eb', color: '#374151', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
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