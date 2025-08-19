// This directive marks this as a Client-side hook.
"use client"

// Inspired by the react-hot-toast library, this hook provides a simple
// and flexible way to show toast notifications.

// --- IMPORTS ---
import * as React from "react" // Core React library.
import type { ToastActionElement, ToastProps } from "@/components/ui/toast" // TypeScript types for toast components.

// --- CONSTANTS ---
// The maximum number of toasts that can be visible at one time.
const TOAST_LIMIT = 1;
// The delay in milliseconds before a dismissed toast is removed from the DOM.
// This allows time for the exit animation to complete.
const TOAST_REMOVE_DELAY = 1000000; // A large number to ensure it doesn't get removed too early.

// --- TYPES ---
// Extends the base ToastProps with additional properties needed for managing toast state.
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Defines the types of actions that can be dispatched to the toast reducer.
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

// --- STATE MANAGEMENT ---
let count = 0; // A counter to generate unique IDs for each toast.

// Generates a unique ID for a toast.
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

// Defines the shape of the actions that can be sent to the reducer.
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] };

// Defines the shape of the state managed by the reducer.
interface State {
  toasts: ToasterToast[];
}

// A map to keep track of the removal timeouts for each toast.
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Adds a toast to the removal queue. When a toast is dismissed, we wait for its
// exit animation to finish before actually removing it from our state.
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return; // Don't add if it's already in the queue.
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// The reducer function handles state changes based on dispatched actions.
// It takes the current state and an action, and returns the new state.
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Add a new toast to the beginning of the array.
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    // Update an existing toast.
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    // Mark a toast as "closed" so it can animate out.
    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    // Remove a toast from the state completely.
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// --- HOOK IMPLEMENTATION ---
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

// The dispatch function sends an action to the reducer to update the state.
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

/**
 * The main function to create a new toast.
 * @param {Toast} props - The properties for the toast (title, description, etc.).
 * @returns An object with methods to control the toast (dismiss, update).
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id: id, dismiss, update };
}

/**
 * The `useToast` hook, which components can use to access the toast state and functions.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// Export the hook and the toast function.
export { useToast, toast };
