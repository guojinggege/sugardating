"use client";
import { useRef, useState, useTransition } from "react";
import { addComment } from "./actions";

export default function CommentForm({ slug }: { slug: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addComment(slug, fd);
      if (res.ok) {
        ref.current?.reset();
      } else {
        setError(res.error ?? "提交失败");
      }
    });
  };

  return (
    <form ref={ref} onSubmit={onSubmit} className="cmt-form">
      <input
        name="authorName"
        required
        maxLength={40}
        placeholder="你的名字"
        className="cmt-input"
      />
      <textarea
        name="content"
        required
        maxLength={500}
        placeholder="说点什么…"
        rows={3}
        className="cmt-area"
      />
      {error && <div className="modal-err">{error}</div>}
      <div className="cmt-form-act">
        <span className="cmt-hint">认证登录后续接入,先用占位名字</span>
        <button type="submit" className="btn btn-ink" disabled={pending}>
          {pending ? "提交中…" : "发评论"}
        </button>
      </div>
    </form>
  );
}
