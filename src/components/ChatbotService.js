import React, { useState } from 'react';
import { MessageSquare, Languages, FileText, Send, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../services/apiService';

const ChatbotService = () => {
  // États pour la traduction
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState(null);

  // États pour le résumé
  const [textToSummarize, setTextToSummarize] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryStats, setSummaryStats] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState(null);
  const [ratio, setRatio] = useState(0.3);

  // ==========================================
  // TRADUCTION
  // ==========================================
  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      setTranslateError('Veuillez entrer du texte à traduire');
      return;
    }

    setTranslating(true);
    setTranslateError(null);
    setTranslation('');

    try {
      console.log('🌐 [ChatbotService] Sending translation request:', textToTranslate);
      const result = await apiService.translateText(textToTranslate);
      console.log('✅ [ChatbotService] Translation result:', result);
      
      // Vérifier si la réponse contient translated_text
      if (result && result.translated_text) {
        setTranslation(result.translated_text);
      } else if (result && result.error) {
        // Si le backend retourne une erreur
        throw new Error(result.detail || result.error);
      } else {
        // Format de réponse inattendu
        console.error('Unexpected response format:', result);
        throw new Error('Format de réponse invalide du serveur');
      }
    } catch (err) {
      console.error('❌ [ChatbotService] Translation error:', err);
      
      // Améliorer le message d'erreur
      let errorMessage = 'Erreur lors de la traduction';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le gateway est démarré sur le port 8090.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Le serveur met trop de temps à répondre. Réessayez dans quelques instants.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setTranslateError(errorMessage);
    } finally {
      setTranslating(false);
    }
  };

  const clearTranslation = () => {
    setTextToTranslate('');
    setTranslation('');
    setTranslateError(null);
  };

  // ==========================================
  // RÉSUMÉ
  // ==========================================
  const handleSummarize = async () => {
    if (!textToSummarize.trim()) {
      setSummarizeError('Veuillez entrer du texte à résumer');
      return;
    }

    const words = textToSummarize.trim().split(/\s+/).length;
    if (words < 10) {
      setSummarizeError('Le texte doit contenir au moins 10 mots');
      return;
    }

    setSummarizing(true);
    setSummarizeError(null);
    setSummary('');
    setSummaryStats(null);

    try {
      console.log('📝 [ChatbotService] Sending summarization request:', { 
        length: words, 
        ratio 
      });
      
      const result = await apiService.summarizeText(textToSummarize, ratio);
      console.log('✅ [ChatbotService] Summarization result:', result);
      
      // Vérifier si la réponse contient summary
      if (result && result.summary) {
        setSummary(result.summary);
        setSummaryStats({
          original: result.original_length,
          summary: result.summary_length,
          compression: result.compression_ratio,
          warning: result.warning
        });
      } else if (result && result.error) {
        // Si le backend retourne une erreur
        throw new Error(result.detail || result.error);
      } else {
        // Format de réponse inattendu
        console.error('Unexpected response format:', result);
        throw new Error('Format de réponse invalide du serveur');
      }
    } catch (err) {
      console.error('❌ [ChatbotService] Summarization error:', err);
      
      // Améliorer le message d'erreur
      let errorMessage = 'Erreur lors du résumé';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le gateway est démarré sur le port 8090.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Le serveur met trop de temps à répondre. Réessayez dans quelques instants.';
      } else if (err.message.includes('too short')) {
        errorMessage = 'Le texte est trop court pour être résumé (minimum 10 mots)';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSummarizeError(errorMessage);
    } finally {
      setSummarizing(false);
    }
  };

  const clearSummary = () => {
    setTextToSummarize('');
    setSummary('');
    setSummaryStats(null);
    setSummarizeError(null);
  };

  return (
    <div className="service-container">
      {/* Header */}
      <div className="service-header">
        <div className="service-title">
          <MessageSquare size={32} className="service-icon" />
          <div>
            <h2>Assistant IA</h2>
            <p>Traduction et résumé de texte alimentés par l'IA</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* ==========================================
            SECTION TRADUCTION
        ========================================== */}
        <section style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Languages size={28} style={{ color: '#2563eb' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
                Traduction (EN → FR)
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                Traduisez du texte anglais vers le français
              </p>
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>
              Texte en anglais
            </label>
            <textarea
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              placeholder="Enter English text here... (e.g., Hello, how are you today?)"
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={handleTranslate}
              disabled={translating || !textToTranslate.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: translating ? '#94a3b8' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: translating ? 'not-allowed' : 'pointer'
              }}
            >
              {translating ? <RefreshCw size={20} className="spinning" /> : <Send size={20} />}
              {translating ? 'Traduction...' : 'Traduire'}
            </button>
            <button 
              onClick={clearTranslation}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Effacer
            </button>
          </div>

          {/* Erreur */}
          {translateError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={20} />
              <span>{translateError}</span>
            </div>
          )}

          {/* Résultat */}
          {translation && (
            <div style={{
              padding: '1.5rem',
              background: '#f0f9ff',
              border: '2px solid #bfdbfe',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: '#1e40af' }} />
                <strong style={{ color: '#1e40af' }}>Traduction en français :</strong>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '1.125rem', 
                lineHeight: '1.75',
                color: '#1e293b'
              }}>
                {translation}
              </p>
            </div>
          )}
        </section>

        {/* ==========================================
            SECTION RÉSUMÉ
        ========================================== */}
        <section style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <FileText size={28} style={{ color: '#10b981' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
                Résumé de texte
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                Résumez automatiquement vos textes (minimum 10 mots)
              </p>
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>
              Texte à résumer
            </label>
            <textarea
              value={textToSummarize}
              onChange={(e) => setTextToSummarize(e.target.value)}
              placeholder="Entrez votre texte ici (minimum 10 mots)..."
              rows="6"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              Mots: {textToSummarize.trim().split(/\s+/).filter(w => w).length}
            </div>
          </div>

          {/* Ratio */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>
              Niveau de compression: {Math.round(ratio * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>Plus court</span>
              <span>Plus long</span>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={handleSummarize}
              disabled={summarizing || textToSummarize.trim().split(/\s+/).length < 10}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: summarizing ? '#94a3b8' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: summarizing ? 'not-allowed' : 'pointer'
              }}
            >
              {summarizing ? <RefreshCw size={20} className="spinning" /> : <FileText size={20} />}
              {summarizing ? 'Génération...' : 'Résumer'}
            </button>
            <button 
              onClick={clearSummary}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Effacer
            </button>
          </div>

          {/* Erreur */}
          {summarizeError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={20} />
              <span>{summarizeError}</span>
            </div>
          )}

          {/* Résultat */}
          {summary && (
            <>
              <div style={{
                padding: '1.5rem',
                background: '#f0fdf4',
                border: '2px solid #bbf7d0',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle size={20} style={{ color: '#166534' }} />
                  <strong style={{ color: '#166534' }}>Résumé :</strong>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1.125rem', 
                  lineHeight: '1.75',
                  color: '#1e293b'
                }}>
                  {summary}
                </p>
              </div>

              {/* Stats */}
              {summaryStats && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      TEXTE ORIGINAL
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                      {summaryStats.original}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>mots</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      RÉSUMÉ
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                      {summaryStats.summary}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>mots</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      COMPRESSION
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>
                      {Math.round(summaryStats.compression * 100)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>du texte original</div>
                  </div>
                </div>
              )}

              {summaryStats?.warning && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  color: '#92400e',
                  marginTop: '1rem'
                }}>
                  <AlertCircle size={20} />
                  <span>{summaryStats.warning}</span>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatbotService;