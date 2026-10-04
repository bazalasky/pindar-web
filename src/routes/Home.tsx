import { useAuth } from '../auth/AuthContext';
import { type Activity } from '../api/types';
import { useState, useEffect } from 'react';
import { getActivities } from '../api/client';

export function Home() {
    const { logout } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // const onMountFetchActivities = async () => {
    //     setError(null);

    //     try {
    //         const response = await getActivities();
    //         setActivities(response);
    //     } catch (err) {
    //         setError(`Error fetching activities: ${err instanceof Error ? err.message : String(err)}`);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        const fetchActivities = async () => {
            setError(null);

            try {
                const response = await getActivities();
                setActivities(response);
            } catch (err) {
                setError(`Error fetching activities: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };

        void fetchActivities();
    }, []);

    function dateFormatter(dateString: string): string {
        return dateString.substring(0, 10);
    }

    return (
        <div>
            <h1>Pindar</h1>

            {loading ? (
                <p>Loading activities...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : activities.length === 0 ? (
                <p>No activities found.</p>
            ) : (
                <h2>Activities</h2>
            )}

            {activities.map((activity) => (
                <div key={activity.id}>
                    <p>Activity Type: {activity.activityType}</p>
                    <p>Date: {dateFormatter(activity.date)}</p>
                    <p>Duration (seconds): {activity.durationSeconds}</p>
                    <p>Notes: {activity.notes}</p>
                    <p>Bodyweight: {activity.bodyweight}</p>

                    {activity.liftActivity && (
                        <div>
                            <h3>Lift Activity</h3>
                            {activity.liftActivity.sets.map((set) => (
                                <div key={set.setNumber}>
                                    <p>Exercise ID: {set.exerciseId}</p>
                                    <p>Set Number: {set.setNumber}</p>
                                    <p>Reps: {set.reps}</p>
                                    <p>Weight: {set.weight}</p>
                                    <p>RPE: {set.rpe}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activity.runActivity && (
                        <div>
                            <h3>Run Activity</h3>
                            <p>Distance: {activity.runActivity.distance}</p>
                            <p>Elevation: {activity.runActivity.elevation}</p>
                            <p>Heart Rate: {activity.runActivity.heartRate}</p>
                        </div>
                    )}
                </div>
            ))}

            <hr />
            <button onClick={logout}>Logout</button>
        </div>
    );
}
