import React, { createContext, useContext, useState } from 'react';

const PersonaContext = createContext();

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

export const PersonaProvider = ({ children }) => {
  const initialPersonas = [
    { id: 1, name: 'Tech Guru', platform: 'Hashnode', niche: 'AI/ML', brandColor: '#00ff00' },
    { id: 2, name: 'Dev Insights', platform: 'Dev.to', niche: 'Web Dev', brandColor: '#ff0000' },
    { id: 3, name: 'AI Whisperer', platform: 'Medium', niche: 'AI Ethics', brandColor: '#0000ff' },
    { id: 4, name: 'Code Ninja', platform: 'Hashnode', niche: 'Programming', brandColor: '#ffff00' },
    { id: 5, name: 'Future Tech', platform: 'Dev.to', niche: 'Emerging Tech', brandColor: '#ff00ff' },
  ];

  const [personas] = useState(initialPersonas);
  const [currentPersona, setCurrentPersona] = useState(initialPersonas[0]);

  const switchPersona = (personaId) => {
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      setCurrentPersona(persona);
    }
  };

  return (
    <PersonaContext.Provider value={{ personas, currentPersona, switchPersona }}>
      {children}
    </PersonaContext.Provider>
  );
};