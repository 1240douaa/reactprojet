import React from 'react';
import { Users, BookOpen, MessageSquare, Database, TrendingUp, Award } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestion des Étudiants',
      description: 'Gérez facilement les profils des étudiants, leurs informations personnelles et leurs affiliations universitaires.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Gestion des Cours',
      description: 'Organisez les cours, planifiez les horaires et gérez les inscriptions des étudiants.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Database,
      title: 'Inscriptions GraphQL',
      description: 'Système d\'inscription optimisé avec GraphQL pour des requêtes rapides et efficaces.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: MessageSquare,
      title: 'Assistant IA',
      description: 'Chatbot intelligent pour la traduction et le résumé de textes académiques.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const stats = [
    { label: 'Étudiants Actifs', value: '2,500+', icon: Users },
    { label: 'Cours Disponibles', value: '150+', icon: BookOpen },
    { label: 'Inscriptions', value: '8,000+', icon: TrendingUp },
    { label: 'Taux de Réussite', value: '94%', icon: Award }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <img 
          src="https://www.collegetransitions.com/wp-content/uploads/2024/12/college-student-life.jpg"
          alt="Campus Student Life"
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Système de Gestion Campus
            </h1>
            <p className="hero-description">
              Plateforme moderne et intelligente pour la gestion complète des étudiants, cours et inscriptions
            </p>
            <div className="hero-actions">
              <button className="btn-hero-primary">
                Commencer
              </button>
              <button className="btn-hero-secondary">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            Fonctionnalités Principales
          </h2>
          <p className="section-description">
            Des outils puissants pour une gestion efficace de votre campus
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <Icon size={32} />
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Section */}
      <div className="architecture-section">
        <div className="section-header">
          <h2 className="section-title">
            Architecture Microservices
          </h2>
          <p className="section-description">
            Une architecture moderne, scalable et performante
          </p>
        </div>

        <div className="architecture-grid">
          <div className="architecture-card">
            <div className="architecture-number blue">1</div>
            <h4 className="architecture-title">Spring Boot</h4>
            <p className="architecture-description">Service Étudiants avec REST API</p>
          </div>

          <div className="architecture-card">
            <div className="architecture-number purple">2</div>
            <h4 className="architecture-title">Django</h4>
            <p className="architecture-description">Services Cours & Chatbot IA</p>
          </div>

          <div className="architecture-card">
            <div className="architecture-number pink">3</div>
            <h4 className="architecture-title">GraphQL</h4>
            <p className="architecture-description">Requêtes optimisées multi-services</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2 className="cta-title">
          Prêt à commencer ?
        </h2>
        <p className="cta-description">
          Utilisez le menu de navigation pour accéder aux différents services
        </p>
        <button className="btn-cta">
          Explorer les Services
        </button>
      </div>
    </div>
  );
};

export default HomePage;