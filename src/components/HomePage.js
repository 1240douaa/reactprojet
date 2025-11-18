import React from 'react';
import { Users, BookOpen, MessageSquare, Database, TrendingUp, Award } from 'lucide-react';

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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="https://www.collegetransitions.com/wp-content/uploads/2024/12/college-student-life.jpg"
          alt="Campus Student Life"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/70 flex items-center">
          <div className="max-w-4xl mx-auto px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">
              Système de Gestion Campus
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Plateforme moderne et intelligente pour la gestion complète des étudiants, cours et inscriptions
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg">
                Commencer
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-xl text-gray-600">
            Des outils puissants pour une gestion efficace de votre campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Architecture Microservices
          </h2>
          <p className="text-xl text-gray-600">
            Une architecture moderne, scalable et performante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Spring Boot</h4>
              <p className="text-gray-600 text-sm">Service Étudiants avec REST API</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Django</h4>
              <p className="text-gray-600 text-sm">Services Cours & Chatbot IA</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">GraphQL</h4>
              <p className="text-gray-600 text-sm">Requêtes optimisées multi-services</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Utilisez le menu de navigation pour accéder aux différents services
        </p>
        <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
          Explorer les Services
        </button>
      </div>
    </div>
  );
};

export default HomePage;