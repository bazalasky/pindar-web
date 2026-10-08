import { type Exercise, type CreateLiftInput } from '../api/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getExercises, createLift } from '../api/client';

type SetRow = {
    key: string;
    exerciseId: string;
    reps: string;
    weight: string;
    rpe: string;
};

export function NewLift() {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [durationSeconds, setDurationSeconds] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [bodyweight, setBodyweight] = useState('');
    const [sets, setSets] = useState<SetRow[]>([{ key: crypto.randomUUID(), exerciseId: '', reps: '', weight: '', rpe: '' }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            setError(null);
            try {
                const response = await getExercises();
                setExercises(response);
            } catch (err) {
                setError(`Error fetching activities: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };

        void fetchExercises();
    }, []);

    function addSet() {
        setSets(sets => [...sets, { key: crypto.randomUUID(), exerciseId: '', reps: '', weight: '', rpe: '' }]);
    }

    function removeSet(key: string) {
        setSets(sets => sets.filter(set => set.key !== key));
    }

    function updateSet(key: string, patch: Partial<Omit<SetRow, 'key'>>) {
        setSets(sets => sets.map(set => set.key === key ? { ...set, ...patch } : set));
    }

    async function handleSubmit(ev: React.SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);
        setSubmitting(true);
        const payload: CreateLiftInput = {
            date: date,
            durationSeconds: Number(durationSeconds),
            notes: notes || undefined,
            bodyweight: bodyweight || undefined,
            sets: sets.map((set, index) => ({
                exerciseId: Number(set.exerciseId),
                setNumber: index + 1,
                reps: Number(set.reps),
                weight: set.weight || undefined,
                rpe: set.rpe || undefined,
            })),
        };
        try{
            await createLift(payload);
            navigate('/');
        } catch (err) {
            setError(`Error creating lift: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h1>New Lift</h1>
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
                        Duration (seconds):
                        <input type="number" value={durationSeconds} onChange={e => setDurationSeconds(e.target.value)} required />
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
                    <h2>Sets</h2>
                    {sets.map((set) => (
                        <div key={set.key}>
                            <label>
                                Exercise:
                                <select value={set.exerciseId} onChange={e => updateSet(set.key, { exerciseId: e.target.value })} required>
                                    <option value="">Select exercise</option>
                                    {exercises.map(exercise => (
                                        <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Reps:
                                <input type="number" value={set.reps} onChange={e => updateSet(set.key, { reps: e.target.value })} required />
                            </label>
                            <label>
                                Weight:
                                <input type="number" step="any" value={set.weight} onChange={e => updateSet(set.key, { weight: e.target.value })} />
                            </label>
                            <label>
                                RPE:
                                <input type="number" step="any" value={set.rpe} onChange={e => updateSet(set.key, { rpe: e.target.value })} />
                            </label>
                            <button type="button" onClick={() => removeSet(set.key)}>Remove Set</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSet}>Add Set</button>
                </div>
                <button type="submit" disabled={loading || submitting}>Create Lift</button>
            </form>
         </div>
    );
}