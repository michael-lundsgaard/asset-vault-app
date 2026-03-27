'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Header } from '@/components/organisms/Header';
import { Check, Pencil, X } from 'lucide-react';
import { useState } from 'react';

interface EditableField {
	defaultValue: string;
	placeholder: string;
	/** Read-only suffix appended after the input (e.g. file extension). */
	suffix?: string;
	required?: boolean;
}

interface EditableHeaderProps {
	title: string;
	subtitle?: string;
	/** Extra action buttons rendered alongside the Edit trigger when not editing. */
	actions?: React.ReactNode;
	/** Label for the Edit trigger button. */
	editLabel?: string;
	fields: EditableField[];
	onSave: (values: string[]) => void;
	isSaving?: boolean;
	/** Disables the Edit trigger — use while data is still loading. */
	disabled?: boolean;
}

export function EditableHeader({
	title,
	subtitle,
	actions,
	editLabel = 'Edit',
	fields,
	onSave,
	isSaving,
	disabled,
}: EditableHeaderProps) {
	const [editing, setEditing] = useState(false);
	const [values, setValues] = useState<string[]>([]);

	function openEdit() {
		setValues(fields.map((f) => f.defaultValue));
		setEditing(true);
	}

	function handleSave() {
		onSave(values);
		setEditing(false);
	}

	const canSave = fields.every((f, i) => !f.required || values[i]?.trim());

	if (!editing) {
		return (
			<Header
				title={title}
				subtitle={subtitle}
				actions={
					<div className="flex items-center gap-2">
						<Button variant="ghost" onClick={openEdit} disabled={disabled}>
							<Pencil className="w-4 h-4" />
							{editLabel}
						</Button>
						{actions}
					</div>
				}
			/>
		);
	}

	return (
		<div className="flex items-start gap-3 mb-8">
			<div className="flex-1 space-y-2">
				{fields.map((field, i) => (
					<div key={i} className="flex items-center">
						<Input
							value={values[i] ?? ''}
							onChange={(e) => {
								const next = [...values];
								next[i] = e.target.value;
								setValues(next);
							}}
							placeholder={field.placeholder}
							className={field.suffix ? 'rounded-r-none border-r-0' : undefined}
						/>
						{field.suffix && (
							<span className="h-11 flex items-center px-3 bg-[var(--surface)] border border-[var(--border)] border-l-0 rounded-r-2xl text-sm font-mono text-[var(--subtle)] shrink-0">
								{field.suffix}
							</span>
						)}
					</div>
				))}
			</div>
			<div className="flex gap-2 pt-1 shrink-0">
				<Button size="sm" disabled={!canSave} loading={isSaving} onClick={handleSave}>
					<Check className="w-4 h-4" />
					Save
				</Button>
				<Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
					<X className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
