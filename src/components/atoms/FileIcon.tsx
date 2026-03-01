import { cn } from '@/lib/utils';
import { File, FileAudio, FileImage, FileText, FileVideo } from 'lucide-react';

export function FileIcon({ contentType, className }: { contentType: string; className?: string }) {
	const cls = cn('text-[var(--subtle)]', className);
	if (contentType.startsWith('image/')) return <FileImage className={cls} />;
	if (contentType.startsWith('video/')) return <FileVideo className={cls} />;
	if (contentType.startsWith('audio/')) return <FileAudio className={cls} />;
	if (contentType.startsWith('text/')) return <FileText className={cls} />;
	return <File className={cls} />;
}
