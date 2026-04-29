'use client';
import React from 'react';

export interface SocialLink {
    url: string;
    type: string;
}

const socialTypes = ['LinkedIn', 'GitHub', 'Behance', 'Dribbble', 'X / Twitter', 'Facebook', 'Portfolio', 'Other'];

interface SocialFormProps {
    social: SocialLink;
    onUpdate: (field: keyof SocialLink, value: string) => void;
    onRemove: () => void;
}

export default function SocialForm({ social, onUpdate, onRemove }: SocialFormProps) {
    return (
        <div className="experience-box" style={{ marginBottom: '15px' }}>
            <div className="row" style={{ alignItems: 'flex-end' }}>
                <div className="input-group" style={{ flex: 3 }}>
                    <label>Profile URL</label>
                    <input type="text" placeholder="https://..." value={social.url || ''} onChange={e => onUpdate('url', e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Platform</label>
                    <select value={social.type || 'LinkedIn'} onChange={e => onUpdate('type', e.target.value)}>
                        {socialTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="input-group" style={{ marginBottom: '35px', marginLeft: '20px', display: 'flex', alignItems: 'flex-end' }}>
                    <button type="button" className="remove-link-btn" onClick={onRemove}>Remove</button>
                </div>
            </div>
        </div>
    );
}
