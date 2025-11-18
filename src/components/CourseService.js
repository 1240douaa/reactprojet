import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, BookOpen } from 'lucide-react';
import './CourseService.css';

const CourseService = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    category: '',
    schedule: ''
  });

  const API_URL = 'http://localhost:8090/gateway/courses_service';

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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours:', error);
    }
    setLoading(false);
  };

  const handleAddCourse = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchCourses();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleEditCourse = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedCourse.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchCourses();
        setShowEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        const response = await fetch(`${API_URL}/${id}/`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCourses();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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

  const resetForm = () => {
    setFormData({
      name: '',
      instructor: '',
      category: '',
      schedule: ''
    });
    setSelectedCourse(null);
  };

  const Modal = ({ show, onClose, title, onSave, children }) => {
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
          <div className="modal-actions">
            <button onClick={onSave} className="btn btn-primary purple">
              <Save size={20} />
              <span>Enregistrer</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
          </div>
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
          {filteredCourses.map((course) => (
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
                <div className="course-actions">
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
          ))}
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
    </div>
  );
};

export default CourseService;