"use client"
import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const fetcher = async([url, token]: [string, string | null]) => {
  const headers: HeadersInit = {
    "Content-type": "application/json",
  }

  if(token) {
  headers["Authorization"] = token;
  }


  const res = await fetch(url, {
    headers: headers,
  });

  if(!res.ok) {
    throw new Error("エラーが発生しました")
  }
  return res.json()
}

export const useFetch = <T>(url: string | null, requireAuth: boolean = true) => {
  const { token } = useSupabaseSession()

  const shouldFetch = url && (!requireAuth || token);

  const { data, error, isLoading, mutate } = useSWR<T>(
    shouldFetch ? [url, token]: null,
    fetcher
  )

  return {
    data, error, isLoading, mutate,
  }
}