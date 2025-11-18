import React, { useState } from 'react';
import { MessageSquare, Languages, FileText, Send, Loader } from 'lucide-react';

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
      setTranslateOutput('Erreur lors de la traduction');
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
      setSummarizeOutput('Erreur lors de la génération du résumé');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="https://i.pinimg.com/1200x/db/7c/19/db7c190693e054346e047d9a4480a838.jpg"
          alt="AI Chatbot"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-900/70 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <h1 className="text-4xl font-bold text-white mb-2">Assistant IA</h1>
            <p className="text-green-100 text-lg">Traduction et résumé de textes académiques</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('translate')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'translate'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Languages className="w-5 h-5" />
          <span>Traduction</span>
        </button>
        <button
          onClick={() => setActiveTab('summarize')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'summarize'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Résumé</span>
        </button>
      </div>

      {/* Translation Tab */}
      {activeTab === 'translate' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Traduction de Texte</h2>
              <p className="text-gray-600">Traduisez vos textes académiques instantanément</p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-center space-x-4 mb-6">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none font-semibold"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="ar">Arabe</option>
              <option value="es">Espagnol</option>
            </select>
            <div className="text-gray-400">→</div>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none font-semibold"
            >
              <option value="en">Anglais</option>
              <option value="fr">Français</option>
              <option value="ar">Arabe</option>
              <option value="es">Espagnol</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Texte Source
              </label>
              <textarea
                value={translateInput}
                onChange={(e) => setTranslateInput(e.target.value)}
                placeholder="Entrez le texte à traduire..."
                className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Traduction
              </label>
              <div className="w-full h-64 px-4 py-3 border-2 border-green-100 rounded-lg bg-green-50 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : translateOutput ? (
                  <p className="text-gray-800">{translateOutput}</p>
                ) : (
                  <p className="text-gray-400">La traduction apparaîtra ici...</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading || !translateInput.trim()}
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>Traduire</span>
          </button>
        </div>
      )}

      {/* Summarization Tab */}
      {activeTab === 'summarize' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Résumé de Texte</h2>
              <p className="text-gray-600">Générez des résumés concis de vos documents</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Texte à Résumer
              </label>
              <textarea
                value={summarizeInput}
                onChange={(e) => setSummarizeInput(e.target.value)}
                placeholder="Entrez le texte à résumer..."
                className="w-full h-96 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Résumé Généré
              </label>
              <div className="w-full h-96 px-4 py-3 border-2 border-green-100 rounded-lg bg-green-50 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : summarizeOutput ? (
                  <p className="text-gray-800 leading-relaxed">{summarizeOutput}</p>
                ) : (
                  <p className="text-gray-400">Le résumé apparaîtra ici...</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={loading || !summarizeInput.trim()}
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>Générer le Résumé</span>
          </button>
        </div>
      )}

      {/* Features Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <Languages className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Traduction Multilingue</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• Support de plusieurs langues</li>
            <li>• Traduction instantanée</li>
            <li>• Contexte académique optimisé</li>
            <li>• Interface intuitive</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Résumé Intelligent</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• Résumés concis et précis</li>
            <li>• Conservation des points clés</li>
            <li>• Traitement de longs documents</li>
            <li>• Résultats en temps réel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatbotService;