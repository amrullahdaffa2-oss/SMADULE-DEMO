import { supabase } from './supabase'

export type AuthUser = {
  id: string
  email: string
  role: 'guru' | 'murid' | 'orangtua'
  name: string
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user?: AuthUser; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  const meta = data.user?.user_metadata
  return {
    user: {
      id: data.user!.id,
      email: data.user!.email!,
      role: (meta?.role ?? 'murid') as AuthUser['role'],
      name: meta?.name ?? data.user!.email!,
    },
  }
}

export async function signUp(
  email: string,
  password: string,
  role: 'murid' | 'orangtua' | 'guru',
  name: string,
  extra?: Record<string, string>
): Promise<{ user?: AuthUser; needsConfirmation?: boolean; error?: string }> {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, name, ...extra } },
  })
  if (signUpError) return { error: signUpError.message }

  // Attempt immediate sign-in — works when email confirmation is disabled in Supabase Dashboard.
  // If confirmation is required, signInWithPassword will fail and we fall through gracefully.
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (!signInError && data?.user) {
    const meta = data.user.user_metadata
    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: (meta?.role ?? 'murid') as AuthUser['role'],
        name: meta?.name ?? data.user.email!,
      },
    }
  }

  return { needsConfirmation: true }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) return null
  const meta = session.user.user_metadata
  return {
    id: session.user.id,
    email: session.user.email!,
    role: (meta?.role ?? 'murid') as AuthUser['role'],
    name: meta?.name ?? session.user.email!,
  }
}
