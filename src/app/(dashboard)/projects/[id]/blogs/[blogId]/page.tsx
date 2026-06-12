'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Send, Check, X, RotateCcw, Upload, Trash2, Save, Clock, ExternalLink,
} from 'lucide-react';
import { blogsApi } from '@/lib/api/blogs.api';
import { extractError } from '@/lib/api/client';
import { Blog, BlogHistory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Spinner, Btn, Input, Label, Pill } from '@/components/ui';
import { Modal } from '@/components/Modal';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function BlogEditorPage() {
  const { id: projectId, blogId } = useParams<{ id: string; blogId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = blogId === 'new';
  const isReviewer = user?.role === 'AGENCY_ADMIN' || user?.role === 'SEO_EXPERT';

  const [blog, setBlog] = useState<Blog | null>(null);
  const [history, setHistory] = useState<BlogHistory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', featuredImageUrl: '' });
  const [noteModal, setNoteModal] = useState<null | 'reject' | 'request-changes'>(null);
  const [note, setNote] = useState('');
  const [publishModal, setPublishModal] = useState(false);

  const load = useCallback(() => {
    if (isNew) return;
    Promise.all([blogsApi.getById(projectId, blogId), blogsApi.getHistory(projectId, blogId)])
      .then(([b, h]) => {
        setBlog(b); setHistory(h);
        setForm({ title: b.title, slug: b.slug, content: b.content, metaTitle: b.metaTitle || '', metaDescription: b.metaDescription || '', featuredImageUrl: b.featuredImageUrl || '' });
      })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [isNew, projectId, blogId]);
  useEffect(load, [load]);

  const isAuthor = !!blog && user?.id === blog.authorId;
  const editable = isNew || (isAuthor && (blog?.status === 'DRAFT' || blog?.status === 'CHANGES_REQUESTED'));

  const create = async () => {
    setBusy(true); setError('');
    try {
      const b = await blogsApi.create(projectId, { ...form, slug: form.slug || slugify(form.title) });
      router.replace(`/projects/${projectId}/blogs/${b.id}`);
    } catch (e) { setError(extractError(e)); setBusy(false); }
  };
  const save = async () => { setBusy(true); try { await blogsApi.update(projectId, blogId, form); load(); } catch (e) { setError(extractError(e)); } finally { setBusy(false); } };
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); try { await fn(); setNoteModal(null); setNote(''); load(); } catch (e) { setError(extractError(e)); } finally { setBusy(false); } };
  const del = async () => { setBusy(true); try { await blogsApi.delete(projectId, blogId); router.replace(`/projects/${projectId}`); } catch (e) { setError(extractError(e)); setBusy(false); } };
  const publish = async (cms: 'WORDPRESS' | 'SHOPIFY') => { setPublishModal(false); act(() => blogsApi.publish(projectId, blogId, cms)); };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}`} className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"><ArrowLeft size={14} /> Project</Link>
      <PageHeader
        title={isNew ? 'New Blog' : (blog?.title || 'Blog')}
        actions={blog ? <Pill status={blog.status} /> : undefined}
      />
      {error && <Card className="p-3 text-[12.5px] text-red">{error}</Card>}
      {blog?.reviewerNote && (blog.status === 'CHANGES_REQUESTED' || blog.status === 'REJECTED') && (
        <Card className="p-4 border-l-2 border-l-accent">
          <p className="text-[11.5px] font-semibold text-muted uppercase tracking-wide mb-1">Reviewer note</p>
          <p className="text-[13px] text-ink">{blog.reviewerNote}</p>
        </Card>
      )}

      {/* Editor */}
      <Card className="p-5 space-y-4">
        <div className="space-y-1.5"><Label>Title</Label>
          <Input value={form.title} disabled={!editable}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: isNew && !form.slug ? slugify(e.target.value) : form.slug })} />
        </div>
        <div className="space-y-1.5"><Label>Slug</Label><Input value={form.slug} disabled={!editable} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post" /></div>
        <div className="space-y-1.5"><Label>Content (HTML)</Label>
          <textarea value={form.content} disabled={!editable} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12}
            className="w-full px-3 py-2.5 rounded-btn hairline bg-surface text-[13.5px] text-ink outline-none focus:shadow-ring placeholder:text-muted font-mono leading-relaxed disabled:opacity-70" placeholder="<p>Write your post…</p>" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Meta title</Label><Input value={form.metaTitle} disabled={!editable} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Featured image URL</Label><Input value={form.featuredImageUrl} disabled={!editable} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} /></div>
        </div>
        <div className="space-y-1.5"><Label>Meta description</Label><Input value={form.metaDescription} disabled={!editable} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} /></div>
      </Card>

      {/* Live link */}
      {blog?.livePostUrl && (
        <a href={blog.livePostUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[12.5px] text-brand hover:underline">
          View published post <ExternalLink size={12} />
        </a>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isNew && <Btn icon={<Save size={14} />} onClick={create} loading={busy} disabled={!form.title || !form.content}>Create Draft</Btn>}
        {!isNew && editable && <Btn variant="secondary" icon={<Save size={14} />} onClick={save} loading={busy}>Save</Btn>}
        {!isNew && isAuthor && (blog?.status === 'DRAFT' || blog?.status === 'CHANGES_REQUESTED') &&
          <Btn icon={<Send size={14} />} onClick={() => act(() => blogsApi.submit(projectId, blogId))} loading={busy}>Submit for Review</Btn>}
        {!isNew && isAuthor && blog?.status === 'APPROVED' &&
          <Btn icon={<Upload size={14} />} onClick={() => setPublishModal(true)} loading={busy}>Publish</Btn>}
        {!isNew && isAuthor && blog?.status === 'DRAFT' &&
          <Btn variant="danger" icon={<Trash2 size={14} />} onClick={del} loading={busy}>Delete</Btn>}

        {!isNew && isReviewer && blog?.status === 'IN_REVIEW' && (
          <>
            <Btn icon={<Check size={14} />} onClick={() => act(() => blogsApi.approve(projectId, blogId))} loading={busy}>Approve</Btn>
            <Btn variant="secondary" icon={<RotateCcw size={14} />} onClick={() => setNoteModal('request-changes')}>Request Changes</Btn>
            <Btn variant="danger" icon={<X size={14} />} onClick={() => setNoteModal('reject')}>Reject</Btn>
          </>
        )}
      </div>

      {/* History */}
      {!isNew && history.length > 0 && (
        <Card className="p-5">
          <h2 className="text-[14px] font-semibold text-ink mb-3 flex items-center gap-1.5"><Clock size={14} /> History</h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex gap-3 text-[12.5px]">
                <span className="text-muted shrink-0 w-28">{new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-ink"><span className="font-medium">{h.actor?.name || 'Someone'}</span> {h.action.replace(/_/g, ' ')}{h.note ? ` — “${h.note}”` : ''}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Note modal (reject / request changes) */}
      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title={noteModal === 'reject' ? 'Reject Blog' : 'Request Changes'}
        footer={<><Btn variant="secondary" onClick={() => setNoteModal(null)}>Cancel</Btn>
          <Btn variant={noteModal === 'reject' ? 'danger' : 'primary'} loading={busy}
            onClick={() => act(() => noteModal === 'reject' ? blogsApi.reject(projectId, blogId, note) : blogsApi.requestChanges(projectId, blogId, note))}>
            {noteModal === 'reject' ? 'Reject' : 'Send Back'}
          </Btn></>}>
        <div className="space-y-1.5">
          <Label>Note (optional)</Label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 rounded-btn hairline bg-surface text-[13.5px] text-ink outline-none focus:shadow-ring" placeholder="Tell the author what needs to change…" />
        </div>
      </Modal>

      {/* Publish modal */}
      <Modal open={publishModal} onClose={() => setPublishModal(false)} title="Publish To">
        <div className="space-y-2">
          <button onClick={() => publish('WORDPRESS')} className="w-full px-4 py-3 rounded-btn hairline hover:bg-surface-2 text-left text-[13.5px] font-medium text-ink">WordPress</button>
          <button onClick={() => publish('SHOPIFY')} className="w-full px-4 py-3 rounded-btn hairline hover:bg-surface-2 text-left text-[13.5px] font-medium text-ink">Shopify</button>
        </div>
      </Modal>
    </div>
  );
}
