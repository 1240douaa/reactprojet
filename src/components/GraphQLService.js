import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Database, Users, BookOpen, UserCheck } from 'lucide-react';

const GraphQLService = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
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
      setEnrollments(data.data?.allStudentCourses || []);
      setFilteredEnrollments(data.data?.allStudentCourses || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
    }
    setLoading(false);
  };

  const fetchStudentsAndCourses = async () => {
    try {
      // Fetch students
      const studentsResponse = await fetch('http://localhost:8090/gateway/students_service');
      const studentsData = await studentsResponse.json();
      setStudents(studentsData);

      // Fetch courses
      const coursesResponse = await fetch('http://localhost:8090/gateway/courses_service');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
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
      }
    }
  };

  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  const getCourseById = (courseId) => {
    return courses.find(c => c.id === courseId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="https://i.pinimg.com/1200x/21/10/8e/21108e7b2a6228d26182b7d5792f93d9.jpg"
          alt="GraphQL"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 to-rose-900/70 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Gestion des Inscriptions</h1>
            <p className="text-pink-100 text-lg">Système GraphQL pour inscriptions étudiant-cours</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Inscriptions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{enrollments.length}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Étudiants Inscrits</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Cours Disponibles</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{courses.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par étudiant ou cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Inscription</span>
          </button>
        </div>
      </div>

      {/* Enrollments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune inscription trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Étudiant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID Étudiant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Cours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID Cours</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-pink-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {enrollment.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                          {enrollment.student?.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {enrollment.student?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {enrollment.student?.id || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {enrollment.course?.title || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {enrollment.course?.id || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleRemoveEnrollment(enrollment.id)}
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Annuler</span>
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle Inscription</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sélectionner un Étudiant
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sélectionner un Cours
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
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

            <div className="flex space-x-3">
              <button
                onClick={handleEnroll}
                disabled={!selectedStudent || !selectedCourse}
                className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inscrire
              </button>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudent('');
                  setSelectedCourse('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GraphQL Info */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border-2 border-pink-100">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="w-8 h-8 text-pink-600" />
          <h3 className="text-2xl font-bold text-gray-800">Avantages GraphQL</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-gray-600">
            <li>✓ Requêtes optimisées multi-services</li>
            <li>✓ Récupération de données précises</li>
            <li>✓ Performance améliorée</li>
          </ul>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Réduction des appels réseau</li>
            <li>✓ Flexibilité des requêtes</li>
            <li>✓ Typage fort des données</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GraphQLService;