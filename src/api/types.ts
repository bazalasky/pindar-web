export type Activity = {
    id: number;
    activityType: 'Lift' | 'Run';
    date: string;
    durationSeconds: number;
    notes: string | null;
    bodyweight: string;
    liftActivity: { sets: { exerciseId: number; exercise: Exercise; setNumber: number, reps: number, weight: string, rpe: string }[] } | null;
    runActivity: { distance: string; elevation: number; heartRate: number } | null;
};

export type Exercise = {
    id: number;
    userId: number;
    name: string;
};

export type CreateLiftInput = {
    date: string;
    durationSeconds: number;
    notes?: string;
    bodyweight?: string;
    sets: {
        exerciseId: number;
        setNumber: number;
        reps: number;
        weight?: string;
        rpe?: string;
    }[];
};

export type CreateRunInput = {
    date: string;
    durationSeconds: number;
    notes?: string;
    bodyweight?: string;
    distance?: string;
    elevation?: number;
    heartRate?: number;
};
