import { SegmentedControl } from './SegmentedControl';

type ContentTab = 'assets' | 'collections';

const CONTENT_OPTIONS: { value: ContentTab; label: string }[] = [
	{ value: 'assets', label: 'Assets' },
	{ value: 'collections', label: 'Collections' },
];

export function ContentToggle({ value, onChange }: { value: ContentTab; onChange: (value: ContentTab) => void }) {
	return <SegmentedControl value={value} onChange={onChange} options={CONTENT_OPTIONS} />;
}
