import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, UserPlus, Filter, BookOpen, Users } from 'lucide-react';
import './StudentService.css';

const StudentService = () => {
  // Données statiques
  const staticStudents = [
    {
      id: 1,
      first_name: 'Ahmed',
      last_name: 'Benali',
      email: 'ahmed.benali@univ-constantine2.dz',
      university_id: 'M1-DS-2024-001'
    },
    {
      id: 2,
      first_name: 'Fatima',
      last_name: 'Zahra',
      email: 'fatima.zahra@univ-constantine2.dz',
      university_id: 'M1-DS-2024-002'
    },
    {
      id: 3,
      first_name: 'Yacine',
      last_name: 'Kaddour',
      email: 'yacine.kaddour@univ-constantine2.dz',
      university_id: 'M1-DS-2024-003'
    },
    {
      id: 4,
      first_name: 'Amina',
      last_name: 'Messaoudi',
      email: 'amina.messaoudi@univ-constantine2.dz',
      university_id: 'M1-DS-2024-004'
    },
    {
      id: 5,
      first_name: 'Karim',
      last_name: 'Boudiaf',
      email: 'karim.boudiaf@univ-constantine2.dz',
      university_id: 'M1-DS-2024-005'
    },
    {
      id: 6,
      first_name: 'Samira',
      last_name: 'Hamdi',
      email: 'samira.hamdi@univ-constantine2.dz',
      university_id: 'M1-DS-2024-006'
    }
  ];

  const staticCourses = [
    { id: 1, name: 'Machine Learning Avancé' },
    { id: 2, name: 'Big Data et Analytics' },
    { id: 3, name: 'Deep Learning' },
    { id: 4, name: 'Traitement du Langage Naturel' },
    { id: 5, name: 'Systèmes Distribués' },
    { id: 6, name: 'Visualisation de Données' }
  ];

  const staticEnrollments = [
    { studentId: 1, courseId: 1 },
    { studentId: 1, courseId: 4 },
    { studentId: 2, courseId: 2 },
    { studentId: 3, courseId: 3 },
    { studentId: 4, courseId: 1 },
    { studentId: 5, courseId: 5 },
    { studentId: 6, courseId: 2 },
    { studentId: 6, courseId: 6 }
  ];

  const [students, setStudents] = useState(staticStudents);
  const [courses, setCourses] = useState(staticCourses);
  const [enrollments, setEnrollments] = useState(staticEnrollments);
  const [filteredStudents, setFilteredStudents] = useState(staticStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterCourse, setFilterCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    university_id: ''
  });

  const API_URL = 'http://localhost:8090/gateway/students_service';

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par cours
    if (filterCourse) {
      const enrolledStudentIds = enrollments
        .filter(e => e.courseId === parseInt(filterCourse))
        .map(e => e.studentId);
      filtered = filtered.filter(s => enrolledStudentIds.includes(s.id));
    }

    setFilteredStudents(filtered);
  }, [searchTerm, students, filterCourse, enrollments]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data && data.length > 0) {
        setStudents(data);
        setFilteredStudents(data);
      } else {
        setStudents(staticStudents);
        setFilteredStudents(staticStudents);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      setStudents(staticStudents);
      setFilteredStudents(staticStudents);
    }
    setLoading(false);
  };

  const getStudentCourses = (studentId) => {
    const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
    return studentEnrollments.map(e => courses.find(c => c.id === e.courseId)).filter(Boolean);
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchStudents();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      const newStudent = {
        id: students.length + 1,
        ...formData
      };
      setStudents([...students, newStudent]);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditStudent = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedStudent.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchStudents();
        setShowEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      const updatedStudents = students.map(s => 
        s.id === selectedStudent.id ? { ...s, ...formData } : s
      );
      setStudents(updatedStudents);
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        const response = await fetch(`${API_URL}/${id}/`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchStudents();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setStudents(students.filter(s => s.id !== id));
      }
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      university_id: student.university_id
    });
    setShowEditModal(true);
  };

  const openCoursesModal = (student) => {
    setSelectedStudent(student);
    setShowCoursesModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      university_id: ''
    });
    setSelectedStudent(null);
  };

  const Modal = ({ show, onClose, title, onSave, children, showActions = true }) => {
    if (!show) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button onClick={onClose} className="modal-close">
              <X size={24} />
            </button>
          </div>
          {children}
          {showActions && (
            <div className="modal-actions">
              <button onClick={onSave} className="btn btn-primary">
                <Save size={20} />
                <span>Enregistrer</span>
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="student-service">
      {/* Header with Image */}
      <div className="service-header">
        <img 
          src="https://i.pinimg.com/736x/03/d7/4f/03d74f53d4ad9e459c873213876b76ab.jpg"
          alt="Students"
          className="service-header-image"
        />
        <div className="service-header-overlay blue">
          <div className="service-header-content">
            <h1 className="service-header-title">Gestion des Étudiants</h1>
            <p className="service-header-description">Gérez les profils et informations des étudiants</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card-small blue">
          <Users size={24} />
          <div>
            <p className="stat-label">Total Étudiants</p>
            <p className="stat-value">{students.length}</p>
          </div>
        </div>
        <div className="stat-card-small purple">
          <BookOpen size={24} />
          <div>
            <p className="stat-label">Cours Actifs</p>
            <p className="stat-value">{courses.length}</p>
          </div>
        </div>
        <div className="stat-card-small green">
          <Filter size={24} />
          <div>
            <p className="stat-label">Résultats</p>
            <p className="stat-value">{filteredStudents.length}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter className="filter-icon" size={20} />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les cours</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <UserPlus size={64} color="#d1d5db" />
          <p>Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="students-grid">
          {filteredStudents.map((student) => {
            const studentCourses = getStudentCourses(student.id);
            return (
              <div key={student.id} className="student-card">
                <div className="student-header">
                  <div className="student-avatar blue">
                    {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="student-id">ID: {student.id}</p>
                  </div>
                </div>
                <div className="student-details">
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Université:</strong> {student.university_id || 'Non assigné'}</p>
                </div>
                
                {/* Courses Badge */}
                <div className="student-courses-badge">
                  <BookOpen size={16} />
                  <span>{studentCourses.length} cours inscrit{studentCourses.length > 1 ? 's' : ''}</span>
                </div>

                <div className="student-actions">
                  <button onClick={() => openCoursesModal(student)} className="btn-action green">
                    <BookOpen size={16} />
                    <span>Cours</span>
                  </button>
                  <button onClick={() => openEditModal(student)} className="btn-action blue">
                    <Edit2 size={16} />
                    <span>Modifier</span>
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id)} className="btn-action red">
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        show={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        title="Ajouter un Étudiant"
        onSave={handleAddStudent}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Prénom"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            className="input"
          />
          <input
            type="text"
            placeholder="Nom"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="input"
          />
          <input
            type="text"
            placeholder="ID Université"
            value={formData.university_id}
            onChange={(e) => setFormData({...formData, university_id: e.target.value})}
            className="input"
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        title="Modifier l'Étudiant"
        onSave={handleEditStudent}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Prénom"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            className="input"
          />
          <input
            type="text"
            placeholder="Nom"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="input"
          />
          <input
            type="text"
            placeholder="ID Université"
            value={formData.university_id}
            onChange={(e) => setFormData({...formData, university_id: e.target.value})}
            className="input"
          />
        </div>
      </Modal>

      {/* Courses Modal */}
      <Modal
        show={showCoursesModal}
        onClose={() => { setShowCoursesModal(false); setSelectedStudent(null); }}
        title={`Cours de ${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
        showActions={false}
      >
        <div className="courses-list">
          {selectedStudent && getStudentCourses(selectedStudent.id).length > 0 ? (
            getStudentCourses(selectedStudent.id).map((course, index) => (
              <div key={course.id} className="course-item">
                <div className="course-item-icon purple">
                  <BookOpen size={20} />
                </div>
                <div className="course-item-info">
                  <h4 className="course-item-title">{course.name}</h4>
                  <p className="course-item-id">ID: {course.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-courses">
              <BookOpen size={48} color="#d1d5db" />
              <p>Aucun cours inscrit</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StudentService;