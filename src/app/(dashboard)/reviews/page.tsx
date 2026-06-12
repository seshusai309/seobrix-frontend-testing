'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, RefreshCw, X, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { reviewsApi, blogsApi } from '@/lib/api/blogs.api';
import { extractError } from '@/lib/api/client';
import { Blog } from '@/types';
import { rel } from '@/lib/utils';
import { Card, PageHeader, Pill, Btn, Spinner, EmptyState, Label } from '@/components/ui';
import { Modal } from '@/components/Modal';

export default function ReviewsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'AGENCY_ADMIN';
  const [queue, setQueue] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ blog: Blog; type: 'reject' | 'request-changes' } | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    reviewsApi.getQueue().then(setQueue).catch((e) => setError(extractError(e))).finally(() => setLoading(false));
  }, []);

  const remove = (id: string) => setQueue((q) => q.filter((b) => b.id !== id));

  const approve = async (b: Blog) => {
    setBusyId(b.id);
    try { await blogsApi.approve(b.projectId, b.id); remove(b.id); }
    catch (e) { setError(extractError(e)); } finally { setBusyId(null); }
  };
  const submitNote = async () => {
    if (!noteModal) return;
    setBusyId(noteModal.blog.id);
    try {
      const { blog, type } = noteModal;
      if (type === 'reject') await blogsApi.reject(blog.projectId, blog.id, note);
      else await blogsApi.requestChanges(blog.projectId, blog.id, note);
      remove(blog.id); setNoteModal(null); setNote('');
    } catch (e) { setError(extractError(e)); } finally { setBusyId(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Review Queue" desc={`${queue.length} blog${queue.length !== 1 ? 's' : ''} awaiting review`} />
      {error && <Card className="p-3 text-[12.5px] text-red">{error}</Card>}

      {queue.length === 0 ? (
        <Card><EmptyState title="Queue is clear" desc="All submitted blogs have been reviewed." /></Card>
      ) : (
        <div className="space-y-3">
          {queue.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start gap-3">
                <FileText size={16} className="text-muted mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href={`/projects/${b.projectId}/blogs/${b.id}`} className="text-[14px] font-semibold text-ink hover:text-brand transition-colors">{b.title}</Link>
                  <p className="text-[12px] text-muted mt-0.5">
                    {b.project?.client?.name ? `${b.project.client.name} · ` : ''}{b.author?.name ? `by ${b.author.name} · ` : ''}submitted {rel(b.updatedAt)}
                  </p>
                </div>
                <Pill status={b.status} />
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 mt-4">
                  <Btn size="sm" variant="soft" icon={<Check size={13} />} loading={busyId === b.id} onClick={() => approve(b)}>Approve</Btn>
                  <Btn size="sm" variant="secondary" icon={<RefreshCw size={13} />} onClick={() => { setNote(''); setNoteModal({ blog: b, type: 'request-changes' }); }}>Request Changes</Btn>
                  <Btn size="sm" variant="danger" icon={<X size={13} />} onClick={() => { setNote(''); setNoteModal({ blog: b, type: 'reject' }); }}>Reject</Btn>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title={noteModal?.type === 'reject' ? 'Reject Blog' : 'Request Changes'}
        footer={<><Btn variant="secondary" onClick={() => setNoteModal(null)}>Cancel</Btn>
          <Btn variant={noteModal?.type === 'reject' ? 'danger' : 'primary'} loading={!!busyId} onClick={submitNote}>{noteModal?.type === 'reject' ? 'Reject' : 'Send Back'}</Btn></>}>
        <div className="space-y-1.5">
          <Label>Note (optional)</Label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 rounded-btn hairline bg-surface text-[13.5px] text-ink outline-none focus:shadow-ring" placeholder="Feedback for the author…" />
        </div>
      </Modal>
    </div>
  );
}
