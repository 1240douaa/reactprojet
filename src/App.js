import React, { useState } from 'react';
import { Menu, X, Home, Users, BookOpen, MessageSquare, Database } from 'lucide-react';
import './App.css';
import HomePage from './components/HomePage';
import StudentService from './components/StudentService';
import CourseService from './components/CourseService';
import ChatbotService from './components/ChatbotService';
import GraphQLService from './components/GraphQLService';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', name: 'Accueil', icon: Home },
    { id: 'students', name: 'Étudiants', icon: Users },
    { id: 'courses', name: 'Cours', icon: BookOpen },
    { id: 'graphql', name: 'Inscriptions', icon: Database },
    { id: 'chatbot', name: 'Assistant IA', icon: MessageSquare }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'students': return <StudentService />;
      case 'courses': return <CourseService />;
      case 'graphql': return <GraphQLService />;
      case 'chatbot': return <ChatbotService />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="navbar-logo">
              <div className="logo-icon">
                <BookOpen size={24} />
              </div>
              <div className="logo-text">
                <h1>Campus Manager</h1>
                <p>NTIC Faculty - Constantine 2</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-desktop">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="nav-mobile">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`nav-mobile-button ${currentPage === item.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>© 2025 Abdelhamid Mehri University - Constantine 2</p>
          <p className="footer-subtitle">Master 1 - Data Science and Intelligent Systems</p>
        </div>
      </footer>
    </div>
  );
};

export default App;