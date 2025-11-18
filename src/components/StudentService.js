import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, UserPlus } from 'lucide-react';
import './StudentService.css';

const StudentService = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
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
    const filtered = students.filter(student =>
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
    }
    setLoading(false);
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

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      university_id: ''
    });
    setSelectedStudent(null);
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
            <button onClick={onSave} className="btn btn-primary">
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
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Ajouter un Étudiant</span>
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
          {filteredStudents.map((student) => (
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
              <div className="student-actions">
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
          ))}
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
    </div>
  );
};

export default StudentService;