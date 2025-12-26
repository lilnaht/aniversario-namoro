"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type ActionResult } from "@/app/admin/actions";

const initialState: ActionResult = { ok: true };

export default function AdminLogin() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <div className="mx-auto mt-16 max-w-md rounded-3xl border border-rose-100 bg-white/80 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-rose-700">Entrar no admin</h2>
      <p className="mt-2 text-sm text-rose-500/80">
        Use a senha configurada no ambiente.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-rose-700">
          Senha
          <input
            type="password"
            name="password"
            required
            className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700 shadow-sm focus:border-rose-400"
          />
        </label>
        {state.message ? (
          <p className="text-sm text-rose-600">{state.message}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
