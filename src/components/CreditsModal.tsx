import React from 'react';
import { Credits } from '../types/movie';

interface CreditsModalProps {
    credits: Credits | null;
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ credits, isOpen, onClose, title }) => {
    if (!isOpen || !credits) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Cast & Crew - {title}</h2>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="credits-container">
                    <div className="cast-section">
                        <h3>Cast</h3>
                        <div className="cast-grid">
                            {credits.cast.slice(0, 10).map(actor => (
                                <div key={`${actor.id}-${actor.order}`} className="cast-card">
                                    <img 
                                        src={actor.profile_path || 'https://via.placeholder.com/150x225?text=No+Image'} 
                                        alt={actor.name}
                                    />
                                    <div className="cast-info">
                                        <h4>{actor.name}</h4>
                                        <p>as {actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="crew-section">
                        <h3>Key Crew</h3>
                        <div className="crew-grid">
                            {credits.crew
                                .filter(member => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(member.job))
                                .map(member => (
                                    <div key={`${member.id}-${member.job}`} className="crew-card">
                                        <h4>{member.name}</h4>
                                        <p>{member.job}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsModal; 