import React, { useState } from 'react';
import { MessageSquare, Languages, FileText, Send, Loader, RefreshCw } from 'lucide-react';
import './ChatbotService.css';

const ChatbotService = () => {
  const [activeTab, setActiveTab] = useState('translate');
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState('');
  const [summarizeInput, setSummarizeInput] = useState('');
  const [summarizeOutput, setSummarizeOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');

  const API_URL = 'http://localhost:8090/gateway/ai_service';

  const handleTranslate = async () => {
    if (!translateInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/translate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translateInput,
          source_lang: sourceLang,
          target_lang: targetLang
        })
      });
      const data = await response.json();
      setTranslateOutput(data.translation || data.translated_text || 'Traduction disponible');
    } catch (error) {
      console.error('Erreur lors de la traduction:', error);
      setTranslateOutput('⚠️ Service de traduction temporairement indisponible. Veuillez réessayer ultérieurement.');
    }
    setLoading(false);
  };

  const handleSummarize = async () => {
    if (!summarizeInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/summarize/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: summarizeInput
        })
      });
      const data = await response.json();
      setSummarizeOutput(data.summary || 'Résumé généré avec succès');
    } catch (error) {
      console.error('Erreur lors du résumé:', error);
      setSummarizeOutput('⚠️ Service de résumé temporairement indisponible. Veuillez réessayer ultérieurement.');
    }
    setLoading(false);
  };

  const clearTranslation = () => {
    setTranslateInput('');
    setTranslateOutput('');
  };

  const clearSummary = () => {
    setSummarizeInput('');
    setSummarizeOutput('');
  };

  return (
    <div className="chatbot-service">
      {/* Header with Image */}
      <div className="service-header">
        <img 
          src="https://i.pinimg.com/1200x/db/7c/19/db7c190693e054346e047d9a4480a838.jpg"
          alt="AI Chatbot"
          className="service-header-image"
        />
        <div className="service-header-overlay green">
          <div className="service-header-content">
            <h1 className="service-header-title">Assistant IA</h1>
            <p className="service-header-description">Traduction et résumé de textes académiques</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('translate')}
          className={`tab-button ${activeTab === 'translate' ? 'active green' : ''}`}
        >
          <Languages size={20} />
          <span>Traduction</span>
        </button>
        <button
          onClick={() => setActiveTab('summarize')}
          className={`tab-button ${activeTab === 'summarize' ? 'active green' : ''}`}
        >
          <FileText size={20} />
          <span>Résumé</span>
        </button>
      </div>

      {/* Translation Tab */}
      {activeTab === 'translate' && (
        <div className="service-card">
          <div className="card-header green">
            <div className="header-icon green">
              <Languages size={24} />
            </div>
            <div className="header-text">
              <h2 className="card-title">Traduction de Texte</h2>
              <p className="card-subtitle">Traduisez vos textes académiques instantanément</p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="language-selector">
            <div className="language-select-wrapper">
              <label className="select-label">Langue source</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="language-select green"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 Anglais</option>
                <option value="ar">🇸🇦 Arabe</option>
                <option value="es">🇪🇸 Espagnol</option>
              </select>
            </div>
            
            <div className="language-arrow">→</div>
            
            <div className="language-select-wrapper">
              <label className="select-label">Langue cible</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="language-select green"
              >
                <option value="en">🇬🇧 Anglais</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="ar">🇸🇦 Arabe</option>
                <option value="es">🇪🇸 Espagnol</option>
              </select>
            </div>
          </div>

          <div className="text-areas-grid">
            <div className="text-area-container">
              <div className="text-area-header">
                <label className="text-area-label">Texte Source</label>
                <span className="character-count">{translateInput.length} caractères</span>
              </div>
              <textarea
                value={translateInput}
                onChange={(e) => setTranslateInput(e.target.value)}
                placeholder="Entrez le texte à traduire..."
                className="text-area"
              />
            </div>
            
            <div className="text-area-container">
              <div className="text-area-header">
                <label className="text-area-label">Traduction</label>
                {translateOutput && (
                  <span className="character-count">{translateOutput.length} caractères</span>
                )}
              </div>
              <div className="output-area green">
                {loading ? (
                  <div className="loading-state">
                    <Loader className="spinner green" size={32} />
                    <p>Traduction en cours...</p>
                  </div>
                ) : translateOutput ? (
                  <p className="output-text">{translateOutput}</p>
                ) : (
                  <p className="placeholder-text">La traduction apparaîtra ici...</p>
                )}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleTranslate}
              disabled={loading || !translateInput.trim()}
              className="btn-primary green"
            >
              <Send size={20} />
              <span>Traduire</span>
            </button>
            <button
              onClick={clearTranslation}
              disabled={!translateInput && !translateOutput}
              className="btn-secondary"
            >
              <RefreshCw size={20} />
              <span>Effacer</span>
            </button>
          </div>
        </div>
      )}

      {/* Summarization Tab */}
      {activeTab === 'summarize' && (
        <div className="service-card">
          <div className="card-header green">
            <div className="header-icon green">
              <FileText size={24} />
            </div>
            <div className="header-text">
              <h2 className="card-title">Résumé de Texte</h2>
              <p className="card-subtitle">Générez des résumés concis de vos documents</p>
            </div>
          </div>

          <div className="text-areas-grid">
            <div className="text-area-container">
              <div className="text-area-header">
                <label className="text-area-label">Texte à Résumer</label>
                <span className="character-count">{summarizeInput.length} caractères</span>
              </div>
              <textarea
                value={summarizeInput}
                onChange={(e) => setSummarizeInput(e.target.value)}
                placeholder="Entrez le texte à résumer... (minimum 100 caractères recommandé)"
                className="text-area large"
              />
            </div>
            
            <div className="text-area-container">
              <div className="text-area-header">
                <label className="text-area-label">Résumé Généré</label>
                {summarizeOutput && (
                  <span className="character-count">{summarizeOutput.length} caractères</span>
                )}
              </div>
              <div className="output-area green large">
                {loading ? (
                  <div className="loading-state">
                    <Loader className="spinner green" size={32} />
                    <p>Génération du résumé en cours...</p>
                  </div>
                ) : summarizeOutput ? (
                  <p className="output-text">{summarizeOutput}</p>
                ) : (
                  <p className="placeholder-text">Le résumé apparaîtra ici...</p>
                )}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleSummarize}
              disabled={loading || !summarizeInput.trim()}
              className="btn-primary green"
            >
              <Send size={20} />
              <span>Générer le Résumé</span>
            </button>
            <button
              onClick={clearSummary}
              disabled={!summarizeInput && !summarizeOutput}
              className="btn-secondary"
            >
              <RefreshCw size={20} />
              <span>Effacer</span>
            </button>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="features-info-grid">
        <div className="feature-info-card green">
          <div className="feature-info-header">
            <Languages size={32} className="feature-info-icon" />
            <h3 className="feature-info-title">Traduction Multilingue</h3>
          </div>
          <ul className="feature-info-list">
            <li>✓ Support de plusieurs langues</li>
            <li>✓ Traduction instantanée</li>
            <li>✓ Contexte académique optimisé</li>
            <li>✓ Interface intuitive</li>
          </ul>
        </div>

        <div className="feature-info-card green">
          <div className="feature-info-header">
            <FileText size={32} className="feature-info-icon" />
            <h3 className="feature-info-title">Résumé Intelligent</h3>
          </div>
          <ul className="feature-info-list">
            <li>✓ Résumés concis et précis</li>
            <li>✓ Conservation des points clés</li>
            <li>✓ Traitement de longs documents</li>
            <li>✓ Résultats en temps réel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatbotService;