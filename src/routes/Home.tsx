import { useAuth } from '../auth/AuthContext';

export function Home() {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Pindar</h1>
            <button onClick={logout}>
                Logout
            </button>
        </div>
    )
}
