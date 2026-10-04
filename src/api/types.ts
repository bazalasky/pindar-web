export type Activity = {
    id: number;
    activityType: 'Lift' | 'Run';
    date: string;
    durationSeconds: number;
    notes: string | null;
    bodyweight: string;
    liftActivity: { sets: { exerciseId: number; setNumber: number, reps: number, weight: string, rpe: string }[] } | null;
    runActivity: { distance: string; elevation: number; heartRate: number } | null;
};
