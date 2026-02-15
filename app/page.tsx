
import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import BookmarkList from '@/components/BookmarkList'
import AddBookmark from '@/components/AddBookmark'
import { Bookmark } from '@/lib/types'
import { Bookmark as BookmarkIcon } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let bookmarks: Bookmark[] = []
  if (user) {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) bookmarks = data as Bookmark[]
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <BookmarkIcon size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SmartBookmarks
          </h1>
        </div>
        <AuthButton user={user} />
      </header>

      {!user ? (
        <main className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 py-12">
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
            <h2 className="relative text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
              Your bookmarks,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">reimagined.</span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed border-t border-slate-800/50 pt-8 mt-4">
            Experience the future of bookmarking. Private, secure, and instantly synced across all your devices in real-time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-500 mt-12 w-full max-w-2xl px-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-900/30 transition-colors">
              <span className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg">⚡</span>
              <span className="font-medium text-slate-300">Instant Sync</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-900/30 transition-colors">
              <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">🔒</span>
              <span className="font-medium text-slate-300">Private & Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-900/30 transition-colors">
              <span className="bg-pink-500/10 text-pink-400 p-2 rounded-lg">🎨</span>
              <span className="font-medium text-slate-300">Modern Design</span>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AddBookmark userId={user.id} />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Your Collection</h3>
            <span className="text-xs font-mono text-slate-600 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md">
              Real-time Sync Active
            </span>
          </div>
          <BookmarkList initialBookmarks={bookmarks} userId={user.id} />
        </main>
      )}
    </div>
  )
}
