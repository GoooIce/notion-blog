'use client';

import { useState, useCallback } from 'react';

interface TodoState {
  [blockId: string]: boolean;
}

interface UseTodoStateReturn {
  toggleTodo: (id: string, initialChecked: boolean) => void;
  isChecked: (id: string, initialChecked: boolean) => boolean;
}

export const useTodoState = (): UseTodoStateReturn => {
  const [checkedTodos, setCheckedTodos] = useState<TodoState>({});

  const toggleTodo = useCallback((id: string, initialChecked: boolean) => {
    setCheckedTodos(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !initialChecked
    }));
  }, []);

  const isChecked = useCallback((id: string, initialChecked: boolean) => {
    return checkedTodos[id] !== undefined ? checkedTodos[id] : initialChecked;
  }, [checkedTodos]);

  return { toggleTodo, isChecked };
};
