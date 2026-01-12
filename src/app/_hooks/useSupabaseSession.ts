import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)
      setIsLoading(false)
    }

    fetcher();

    ///ログイン後、ページの再読み込みをしなければヘッダーの表示が変わらなかったため実装
    const {
      data: { subscription: authListener },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setToken(session?.access_token || null)
        setIsLoading(false)
      })
    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  return { session, isLoading, token }
}