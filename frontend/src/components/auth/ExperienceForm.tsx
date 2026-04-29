'use client';
import React from 'react';

export interface Experience {
    company: string;
    startDate: string;
    endDate: string;
    position: string;
    description: string;
}

interface ExperienceFormProps {
    experience: Experience;
    index: number;
    onUpdate: (field: keyof Experience, value: string) => void;
    onRemove: () => void;
}

export default function ExperienceForm({ experience, index, onUpdate, onRemove }: ExperienceFormProps) {
    return (
        <div className="experience-box">
            <div className="box-header">
                <h4>Experience {index + 1}</h4>
                <button type="button" className="remove-link-btn" onClick={onRemove}>Remove</button>
            </div>
            <div className="input-group">
                <label>Company</label>
                <input type="text" placeholder="Company Name" value={experience.company} onChange={e => onUpdate('company', e.target.value)} />
            </div>
            <div className="row">
                <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" value={experience.startDate} onChange={e => onUpdate('startDate', e.target.value)} />
                </div>
                <div className="input-group">
                    <label>End Date (Optional)</label>
                    <input type="date" value={experience.endDate} onChange={e => onUpdate('endDate', e.target.value)} />
                </div>
            </div>
            <div className="input-group">
                <label>Position</label>
                <input type="text" placeholder="e.g. Senior Developer" value={experience.position} onChange={e => onUpdate('position', e.target.value)} />
            </div>
            <div className="input-group">
                <label>Description</label>
                <textarea
                    placeholder="Brief description of your role..."
                    value={experience.description}
                    onChange={e => onUpdate('description', e.target.value)}
                />
            </div>
        </div>
    );
}
