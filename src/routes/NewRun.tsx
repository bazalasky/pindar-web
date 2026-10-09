import { type CreateRunInput } from '../api/types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createRun } from '../api/client';
import { toSeconds } from '../lib/duration';

export function NewRun() {
    const navigate = useNavigate();
    const [durationHours, setDurationHours] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [secondsPart, setSecondsPart] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [bodyweight, setBodyweight] = useState('');
    const [distance, setDistance] = useState('');
    const [elevation, setElevation] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(ev: React.SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);
        const total = toSeconds(Number(durationHours), Number(durationMinutes), Number(secondsPart));
        if (total === null) {
            setError('Duration must be greater than 0');
            return;
        }
        setSubmitting(true);
        const payload: CreateRunInput = {
            date: date,
            durationSeconds: total,
            notes: notes || undefined,
            bodyweight: bodyweight || undefined,
            distance: distance || undefined,
            elevation: elevation ? Number(elevation) : undefined,
            heartRate: heartRate ? Number(heartRate) : undefined,
        };
        try{
            await createRun(payload);
            navigate('/');
        } catch (err) {
            setError(`Error creating run: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h1>New Run</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {submitting && <p>Submitting...</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Date:
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Hours:
                        <input type="number" min="0" value={durationHours} onChange={e => setDurationHours(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Minutes:
                        <input type="number" min="0" max="59" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Seconds:
                        <input type="number" min="0" max="59" value={secondsPart} onChange={e => setSecondsPart(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Notes:
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Bodyweight:
                        <input type="number" step="any" value={bodyweight} onChange={e => setBodyweight(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Distance (Miles): 
                        <input type="number" step="any" value={distance} onChange={e => setDistance(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Elevation (Feet):
                        <input type="number" value={elevation} onChange={e => setElevation(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Heart Rate (BPM):
                        <input type="number" min="1" value={heartRate} onChange={e => setHeartRate(e.target.value)} />
                    </label>
                </div>
                <button type="submit" disabled={submitting}>Create Run</button>
            </form>
         </div>
    );
}