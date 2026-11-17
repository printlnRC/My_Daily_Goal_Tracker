import { UserRound } from 'lucide-react';

type HeaderProps = {
  user: {
    email: string;
  } | null;
  onLogout: () => void;
};

function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="mb-3 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-black italic text-primary">DAILY GOAL TRACKER</h1>
        {user && (
          <p className="mt-1 text-sm text-base-content/70">
            Connecté en tant que {user.email}
          </p>
        )}
      </div>

      <details className="dropdown dropdown-end">
        <summary
          className="btn btn-ghost btn-circle list-none"
          aria-label="Menu du compte"
        >
          <UserRound size={20} />
        </summary>
        <ul className="menu dropdown-content z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow-lg">
          {user && (
            <li className="menu-title">
              <span className="break-all">{user.email}</span>
            </li>
          )}
          <li>
            <button type="button" onClick={onLogout}>
              Déconnexion
            </button>
          </li>
        </ul>
      </details>
    </header>
  );
}

export default Header;
