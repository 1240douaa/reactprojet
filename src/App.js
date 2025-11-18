import React, { useState } from 'react';
import { Menu, X, Home, Users, BookOpen, MessageSquare, Database } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* AppBar */}
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Campus Manager</h1>
                <p className="text-xs text-blue-200">NTIC Faculty - Constantine 2</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-white text-blue-900 shadow-lg'
                        : 'text-white hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-blue-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-white text-blue-900'
                        : 'text-white hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-300">© 2025 Abdelhamid Mehri University - Constantine 2</p>
            <p className="text-sm text-gray-400 mt-2">Master 1 - Data Science and Intelligent Systems</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;