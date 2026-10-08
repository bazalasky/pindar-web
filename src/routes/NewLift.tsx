import { type Exercise, type CreateLiftInput } from '../api/types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getExercises, createLift, createExercise } from '../api/client';
import { toSeconds } from '../lib/duration';

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
    const [durationHours, setDurationHours] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [secondsPart, setSecondsPart] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [bodyweight, setBodyweight] = useState('');
    const [sets, setSets] = useState<SetRow[]>([{ key: crypto.randomUUID(), exerciseId: '', reps: '', weight: '', rpe: '' }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [createExerciseInput, setCreateExerciseInput] = useState('');
    const [createExerciseLoading, setCreateExerciseLoading] = useState(false);
    const [createExerciseError, setCreateExerciseError] = useState<string | null>(null);

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

    async function handleCreateExercise(name: string) {
        const trimmed = name.trim();
        if (!trimmed) {
            setCreateExerciseError('Exercise name cannot be empty');
            return;
        }
        if (exercises.some(exercise => exercise.name.toLowerCase() === trimmed.toLowerCase())) {
            setCreateExerciseInput('');
            setCreateExerciseError('Exercise already exists');
            return;
        }
        try {
            setCreateExerciseError(null);
            setCreateExerciseLoading(true);
            const res = await createExercise(trimmed);
            setExercises(prev => [...prev, res].sort((a, b) => a.name.localeCompare(b.name)));
            setCreateExerciseInput('');
        } catch (err) {
            setCreateExerciseError(`Error creating exercise: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setCreateExerciseLoading(false);
        }
    }

    async function handleSubmit(ev: React.SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        setError(null);
        const total = toSeconds(Number(durationHours), Number(durationMinutes), Number(secondsPart));
        if (total === null) {
            setError('Duration must be greater than 0');
            return;
        }
        setSubmitting(true);
        const payload: CreateLiftInput = {
            date: date,
            durationSeconds: total,
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
                    <h2>Sets</h2>
                    <label>
                        New Exercise:
                    <input type="text" value={createExerciseInput} onChange={e => setCreateExerciseInput(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();          // stops the form submit
                            void handleCreateExercise(createExerciseInput);
                        }
                    }} />
                        {createExerciseError && <p style={{ color: 'red' }}>{createExerciseError}</p>}
                    </label>
                    <button type="button" onClick={() => void handleCreateExercise(createExerciseInput)} disabled={createExerciseLoading}>Create Exercise</button>
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