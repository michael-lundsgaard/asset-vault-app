'use client';

import { useEffect, useRef } from 'react';

export function ScrollSentinel({ onIntersect, enabled }: { onIntersect: () => void; enabled: boolean }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || !enabled) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) onIntersect();
			},
			{ threshold: 0.1 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [enabled, onIntersect]);

	return <div ref={ref} className="h-1" />;
}
