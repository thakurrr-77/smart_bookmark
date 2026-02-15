
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bookmark } from '@/lib/types'
import { Trash2, ExternalLink, Globe } from 'lucide-react'

interface Props {
    initialBookmarks: Bookmark[]
    userId: string
}

export default function BookmarkList({ initialBookmarks, userId }: Props) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Only subscribe to changes for this user
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId])

    const handleDelete = async (id: string) => {
        // Optimistic update for better UX? realtime will confirm it.
        // If we rely purely on realtime, there might be a delay.
        // However, the prompt says "Bookmark list updates in real-time".
        // I will let realtime handle the state update to prove it works as requested.
        // But I'll show a loading state if needed.
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error('Error deleting:', error)
            alert('Error deleting bookmark')
        }
    }

    return (
        <div className="space-y-4">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group relative card-base rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:border-indigo-500/50 hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4 overflow-hidden flex-1">
                        <div className="p-3 bg-indigo-900/20 rounded-lg text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <Globe size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate pr-4 text-sm sm:text-base">
                                {bookmark.title}
                            </h3>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-400 truncate hover:text-indigo-400 flex items-center gap-1 transition-colors w-fit"
                            >
                                {bookmark.url}
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transform sm:translate-x-2 sm:group-hover:translate-x-0"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
            {bookmarks.length === 0 && (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <p>No bookmarks yet. Add your first one!</p>
                </div>
            )}
        </div>
    )
}
