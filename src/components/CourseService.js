import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, BookOpen, Users } from 'lucide-react';
import './CourseService.css';
import apiService from '../services/apiService';

const CourseService = () => {
  // Données statiques (fallback)
  const staticCourses = [
    {
      id: 1,
      name: 'Machine Learning Avancé',
      instructor: 'Dr. Amina Khelifa',
      category: 'Intelligence Artificielle',
      schedule: 'Lundi 10h-12h, Mercredi 14h-16h'
    },
    {
      id: 2,
      name: 'Big Data et Analytics',
      instructor: 'Prof. Karim Bencheikh',
      category: 'Data Science',
      schedule: 'Mardi 8h-10h, Jeudi 10h-12h'
    },
    {
      id: 3,
      name: 'Deep Learning',
      instructor: 'Dr. Fatima Bouaziz',
      category: 'Intelligence Artificielle',
      schedule: 'Mercredi 10h-12h, Vendredi 8h-10h'
    },
    {
      id: 4,
      name: 'Traitement du Langage Naturel',
      instructor: 'Prof. Yacine Mansouri',
      category: 'IA & NLP',
      schedule: 'Lundi 14h-16h, Jeudi 14h-16h'
    },
    {
      id: 5,
      name: 'Systèmes Distribués',
      instructor: 'Dr. Samira Hadj',
      category: 'Architecture',
      schedule: 'Mardi 10h-12h, Vendredi 10h-12h'
    },
    {
      id: 6,
      name: 'Visualisation de Données',
      instructor: 'Prof. Ahmed Meziane',
      category: 'Data Science',
      schedule: 'Mercredi 8h-10h, Jeudi 8h-10h'
    }
  ];

  const staticStudents = [
    { id: 1, first_name: 'Ahmed', last_name: 'Benali' },
    { id: 2, first_name: 'Fatima', last_name: 'Zahra' },
    { id: 3, first_name: 'Yacine', last_name: 'Kaddour' },
    { id: 4, first_name: 'Amina', last_name: 'Messaoudi' },
    { id: 5, first_name: 'Karim', last_name: 'Boudiaf' },
    { id: 6, first_name: 'Samira', last_name: 'Hamdi' }
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

  const [courses, setCourses] = useState(staticCourses);
  const [students, setStudents] = useState(staticStudents);
  const [enrollments, setEnrollments] = useState(staticEnrollments);
  const [filteredCourses, setFilteredCourses] = useState(staticCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    category: '',
    schedule: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // ========================================
  // FETCH DATA VIA GATEWAY
  // ========================================
  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log('🔄 Récupération des cours via Gateway...');
      const data = await apiService.getCourses();
      
      if (data && data.length > 0) {
        console.log('✅ Cours récupérés depuis le Gateway:', data.length);
        setCourses(data);
        setFilteredCourses(data);
      } else {
        console.log('⚠️ Aucune donnée reçue, utilisation des données statiques');
        setCourses(staticCourses);
        setFilteredCourses(staticCourses);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cours:', error);
      console.log('📊 Utilisation des données statiques en fallback');
      setCourses(staticCourses);
      setFilteredCourses(staticCourses);
    }
    setLoading(false);
  };

  const getCourseStudents = (courseId) => {
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    return courseEnrollments.map(e => students.find(s => s.id === e.studentId)).filter(Boolean);
  };

  // ========================================
  // CRUD OPERATIONS VIA GATEWAY
  // ========================================
  const handleAddCourse = async () => {
    try {
      console.log('➕ Ajout d\'un cours via Gateway...');
      await apiService.createCourse(formData);
      console.log('✅ Cours ajouté avec succès');
      fetchCourses();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      console.log('📊 Ajout local en fallback');
      const newCourse = {
        id: courses.length + 1,
        ...formData
      };
      setCourses([...courses, newCourse]);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditCourse = async () => {
    try {
      console.log('✏️ Modification d\'un cours via Gateway...');
      await apiService.updateCourse(selectedCourse.id, formData);
      console.log('✅ Cours modifié avec succès');
      fetchCourses();
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      console.log('📊 Modification locale en fallback');
      const updatedCourses = courses.map(c => 
        c.id === selectedCourse.id ? { ...c, ...formData } : c
      );
      setCourses(updatedCourses);
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        console.log('🗑️ Suppression d\'un cours via Gateway...');
        await apiService.deleteCourse(id);
        console.log('✅ Cours supprimé avec succès');
        fetchCourses();
      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        console.log('📊 Suppression locale en fallback');
        setCourses(courses.filter(c => c.id !== id));
      }
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      instructor: course.instructor,
      category: course.category,
      schedule: course.schedule
    });
    setShowEditModal(true);
  };

  const openStudentsModal = (course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      instructor: '',
      category: '',
      schedule: ''
    });
    setSelectedCourse(null);
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
              <button onClick={onSave} className="btn btn-primary purple">
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
    <div className="course-service">
      {/* Header with Image */}
      <div className="service-header">
        <img 
          src="https://i.pinimg.com/736x/a5/47/dd/a547ddc47b43210ef092b3c01be6ebe8.jpg"
          alt="Courses"
          className="service-header-image"
        />
        <div className="service-header-overlay purple">
          <div className="service-header-content">
            <h1 className="service-header-title">Gestion des Cours</h1>
            <p className="service-header-description">Organisez et gérez les cours académiques</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card-small purple">
          <BookOpen size={24} />
          <div>
            <p className="stat-label">Total Cours</p>
            <p className="stat-value">{courses.length}</p>
          </div>
        </div>
        <div className="stat-card-small blue">
          <Users size={24} />
          <div>
            <p className="stat-label">Étudiants Inscrits</p>
            <p className="stat-value">{enrollments.length}</p>
          </div>
        </div>
        <div className="stat-card-small green">
          <Search size={24} />
          <div>
            <p className="stat-label">Résultats</p>
            <p className="stat-value">{filteredCourses.length}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, instructeur ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input purple"
          />
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary purple">
          <Plus size={20} />
          <span>Ajouter un Cours</span>
        </button>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loader purple"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} color="#d1d5db" />
          <p>Aucun cours trouvé</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => {
            const courseStudents = getCourseStudents(course.id);
            return (
              <div key={course.id} className="course-card">
                <div className="course-header purple">
                  <BookOpen size={64} color="white" />
                </div>
                <div className="course-body">
                  <div className="course-title-section">
                    <h3 className="course-title">{course.name}</h3>
                    <span className="course-badge purple">{course.category}</span>
                  </div>
                  <div className="course-details">
                    <p><strong>Instructeur:</strong> {course.instructor}</p>
                    <p><strong>Horaire:</strong> {course.schedule}</p>
                    <p className="course-id">ID: {course.id}</p>
                  </div>
                  
                  {/* Students Badge */}
                  <div className="course-students-badge">
                    <Users size={16} />
                    <span>{courseStudents.length} étudiant{courseStudents.length > 1 ? 's' : ''} inscrit{courseStudents.length > 1 ? 's' : ''}</span>
                  </div>

                  <div className="course-actions">
                    <button onClick={() => openStudentsModal(course)} className="btn-action blue">
                      <Users size={16} />
                      <span>Étudiants</span>
                    </button>
                    <button onClick={() => openEditModal(course)} className="btn-action purple">
                      <Edit2 size={16} />
                      <span>Modifier</span>
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="btn-action red">
                      <Trash2 size={16} />
                      <span>Supprimer</span>
                    </button>
                  </div>
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
        title="Ajouter un Cours"
        onSave={handleAddCourse}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom du cours"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Instructeur"
            value={formData.instructor}
            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Horaire (ex: Lundi 10h-12h)"
            value={formData.schedule}
            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
            className="input purple"
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        title="Modifier le Cours"
        onSave={handleEditCourse}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom du cours"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Instructeur"
            value={formData.instructor}
            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="input purple"
          />
          <input
            type="text"
            placeholder="Horaire"
            value={formData.schedule}
            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
            className="input purple"
          />
        </div>
      </Modal>

      {/* Students Modal */}
      <Modal
        show={showStudentsModal}
        onClose={() => { setShowStudentsModal(false); setSelectedCourse(null); }}
        title={`Étudiants inscrits - ${selectedCourse?.name}`}
        showActions={false}
      >
        <div className="students-list">
          {selectedCourse && getCourseStudents(selectedCourse.id).length > 0 ? (
            getCourseStudents(selectedCourse.id).map((student) => (
              <div key={student.id} className="student-item">
                <div className="student-item-avatar blue">
                  {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                </div>
                <div className="student-item-info">
                  <h4 className="student-item-name">{student.first_name} {student.last_name}</h4>
                  <p className="student-item-id">ID: {student.id}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-students">
              <Users size={48} color="#d1d5db" />
              <p>Aucun étudiant inscrit</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CourseService;