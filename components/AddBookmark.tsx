
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Link, Type, Loader2 } from 'lucide-react'

export default function AddBookmark({ userId }: { userId: string }) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const { error } = await supabase.from('bookmarks').insert({
            title,
            url,
            user_id: userId,
        })

        if (error) {
            console.error('Error adding bookmark:', error)
            alert(error.message)
        } else {
            setTitle('')
            setUrl('')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl card-base relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Plus size={100} className="text-white" />
            </div>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                    <Plus size={20} />
                </span>
                Add New Bookmark
            </h2>

            <div className="space-y-4 relative z-10">
                <div className="relative group">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" size={18} />
                    <input
                        type="text"
                        placeholder="Title (e.g., My Portfolio)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full input-base rounded-xl py-3.5 pl-12 pr-4 placeholder:text-slate-600 transition-all shadow-inner"
                        required
                    />
                </div>
                <div className="relative group">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" size={18} />
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full input-base rounded-xl py-3.5 pl-12 pr-4 placeholder:text-slate-600 transition-all shadow-inner"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Adding...
                        </>
                    ) : (
                        <>Add Bookmark</>
                    )}
                </button>
            </div>
        </form>
    )
}
