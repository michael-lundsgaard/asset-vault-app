'use client';

import { collectionsCreateMutation, collectionsGetAllQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function CreateCollectionModal({ onClose }: { onClose: () => void }) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const qc = useQueryClient();

	const { mutate, isPending } = useMutation({
		...collectionsCreateMutation(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: collectionsGetAllQueryKey() });
			toast.success('Collection created');
			onClose();
		},
		onError: () => toast.error('Failed to create collection'),
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="card w-full max-w-md p-6 space-y-5">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-[var(--text)]">New Collection</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<div className="space-y-3">
					<Input placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
					<Input
						placeholder="Description (optional)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						disabled={!name.trim()}
						loading={isPending}
						onClick={() => mutate({ body: { name: name.trim(), description: description.trim() || null } })}
					>
						Create
					</Button>
				</div>
			</div>
		</div>
	);
}
