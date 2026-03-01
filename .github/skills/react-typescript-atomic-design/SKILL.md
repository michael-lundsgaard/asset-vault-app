---
name: 'react-typescript-atomic-design'
description: 'React TypeScript project using Atomic Design pattern'
---

# React TypeScript — Atomic Design

## Structure

```
src/
├── components/
│   ├── atoms/        # Smallest indivisible UI units
│   ├── molecules/    # Atoms combined into functional units
│   ├── organisms/    # Complex, self-contained UI sections
│   ├── templates/    # Page layout shells (no real data)
│   └── pages/        # Full views wired with real data/state
├── hooks/            # Custom React hooks (all data fetching lives here)
├── context/          # React Context providers
├── types/            # Shared TypeScript interfaces
├── services/         # API calls
└── utils/            # Pure helper functions
```

Each component lives in its own PascalCase folder:

```
Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts          # export { Button } from './Button'
```

---

## Atomic Layers

### Atom — pure, generic, no business logic

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost';
	isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', isLoading, children, ...rest }) => (
	<button className={`btn btn--${variant}`} disabled={isLoading} aria-busy={isLoading} {...rest}>
		{isLoading ? <Spinner /> : children}
	</button>
);
```

### Molecule — atoms combined, single purpose, still generic

```tsx
export const FormField: React.FC<{ id: string; label: string; error?: string }> = ({ id, label, error }) => (
	<div className="form-field">
		<Label htmlFor={id}>{label}</Label>
		<Input id={id} aria-invalid={!!error} />
		{error && <span role="alert">{error}</span>}
	</div>
);
```

### Organism — domain-aware, may hold local state, emits callbacks

```tsx
export interface LoginFormProps {
	onSubmit: (email: string, password: string) => Promise<void>;
	isLoading?: boolean;
	error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(email, password);
			}}
		>
			<FormField id="email" label="Email" />
			<FormField id="password" label="Password" error={error} />
			<Button isLoading={isLoading}>Sign In</Button>
		</form>
	);
};
```

### Template — layout shell, slot-based, no real data

```tsx
export const AuthLayout: React.FC<{ header?: ReactNode; children: ReactNode }> = ({ header, children }) => (
	<div className="auth-layout">
		{header && <header>{header}</header>}
		<main>{children}</main>
	</div>
);
```

### Page — wires template + organisms + real data/routing

```tsx
export const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login, isLoading, error } = useAuth();
	return (
		<AuthLayout>
			<LoginForm
				onSubmit={async (e, p) => {
					await login(e, p);
					navigate('/dashboard');
				}}
				isLoading={isLoading}
				error={error}
			/>
		</AuthLayout>
	);
};
```

---

## Rules

- **Named exports only** — no default exports for components
- **One component per file**
- **No API calls in components** — use custom `useXxx` hooks
- **No prop drilling > 2 levels** — use Context or a state manager
- **Extend native HTML types** for wrapper components: `extends React.ButtonHTMLAttributes<HTMLButtonElement>`
- **Avoid `any`** — use `unknown` and narrow, or proper generics
- **Atoms and molecules must be stateless** (or minimal UI-only state)
- **Pages own data fetching** — organisms receive data via props/callbacks
- **Accessibility:** `aria-*`, semantic HTML, and keyboard support required in atoms

---

## Naming

| Thing                     | Convention             | Example                    |
| ------------------------- | ---------------------- | -------------------------- |
| Component / File / Folder | PascalCase             | `UserCard`, `UserCard.tsx` |
| Hook                      | `use` + camelCase      | `useUserProfile`           |
| Context                   | PascalCase + `Context` | `AuthContext`              |
| Type / Interface          | PascalCase             | `UserCardProps`            |
| Constant                  | SCREAMING_SNAKE_CASE   | `MAX_RETRIES`              |
| CSS class                 | kebab-case             | `user-card__avatar`        |

---

## Import Order

1. React + external libraries
2. Internal aliases (`@/components`, `@/hooks`, …)
3. Relative imports
4. `import type` statements
5. CSS/style imports

---

## Quick Layer Picker

| What are you building?            | Layer           |
| --------------------------------- | --------------- |
| Button, Input, Icon, Badge        | Atom            |
| SearchBar, FormField, NavItem     | Molecule        |
| Header, LoginForm, ProductGrid    | Organism        |
| Page wrapper with layout slots    | Template        |
| Full view with routing + data     | Page            |
| Data fetching / side effects      | Custom Hook     |
| Cross-cutting state (auth, theme) | Context / Store |
