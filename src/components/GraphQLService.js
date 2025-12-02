import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, AlertCircle, CheckCircle, Users, BookOpen } from 'lucide-react';
import apiService from '../services/apiService';

const GraphQLService = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les inscriptions au démarrage
  useEffect(() => {
    loadInscriptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getStudentCourses();
      setInscriptions(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement inscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-container">
      <div className="service-header">
        <div className="service-title">
          <Database size={32} className="service-icon" />
          <div>
            <h2>Inscriptions (Student Courses)</h2>
            <p>Gestion des inscriptions via table student_courses</p>
          </div>
        </div>
        <button 
          onClick={loadInscriptions} 
          className="refresh-btn"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? 'spinning' : ''} />
          Actualiser
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>Erreur: {error}</span>
        </div>
      )}

      {/* Message de succès */}
      {!loading && !error && inscriptions.length > 0 && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>{inscriptions.length} inscription(s) trouvée(s)</span>
        </div>
      )}

      {/* Tableau des inscriptions */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <RefreshCw size={48} className="spinning" />
            <p>Chargement des inscriptions...</p>
          </div>
        ) : inscriptions.length === 0 ? (
          <div className="empty-state">
            <Database size={48} />
            <p>Aucune inscription trouvée</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student ID</th>
                <th>Course ID</th>
                <th>Nom de l'étudiant</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map((inscription) => (
                <tr key={inscription.id}>
                  <td>{inscription.id}</td>
                  <td>
                    <span className="badge badge-blue">
                      {inscription.student_id}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-green">
                      {inscription.course}
                    </span>
                  </td>
                  <td>
                    {inscription.student_details ? (
                      <strong>
                        {inscription.student_details.firstName} {inscription.student_details.lastName}
                      </strong>
                    ) : (
                      <span className="text-muted">Non disponible</span>
                    )}
                  </td>
                  <td>
                    {inscription.student_details?.email || (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      {inscriptions.length > 0 && (
        <div className="stats-container">
          <div className="stat-card">
            <Database size={24} />
            <div>
              <p className="stat-value">{inscriptions.length}</p>
              <p className="stat-label">Total inscriptions</p>
            </div>
          </div>
          <div className="stat-card">
            <Users size={24} />
            <div>
              <p className="stat-value">
                {new Set(inscriptions.map(i => i.student_id)).size}
              </p>
              <p className="stat-label">Étudiants uniques</p>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen size={24} />
            <div>
              <p className="stat-value">
                {new Set(inscriptions.map(i => i.course)).size}
              </p>
              <p className="stat-label">Cours uniques</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLService;