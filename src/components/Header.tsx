import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

const safeFocusInput = (inputRef: React.RefObject<HTMLInputElement | null>) => {
  requestAnimationFrame(() => {
    const el = inputRef.current;

    if (!el) {
      return;
    }

    const editingFocused = document.querySelector<HTMLInputElement>(
      '[data-cy="TodoTitleField"]:focus',
    );

    if (editingFocused) {
      return;
    }

    if (document.activeElement === el || el.disabled) {
      return;
    }

    el.focus();
  });
};

const NewTodoForm: React.FC<{
  onAdd: (title: string) => Promise<boolean>;
  disabled?: boolean;
  focusTrigger?: number;
}> = ({ onAdd, disabled = false, focusTrigger }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!disabled) {
      safeFocusInput(inputRef);
    }
  }, [disabled]);

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => safeFocusInput(inputRef), 0);
    }
  }, [focusTrigger, disabled]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const success = await onAdd(value);

    if (success) {
      setValue('');
    }

    setTimeout(() => safeFocusInput(inputRef), 0);
  };

  return (
    <form onSubmit={submit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        onBlur={() => submit()}
      />
    </form>
  );
};

export const Header: React.FC<{
  toggleAllActive: boolean;
  onToggleAll: () => Promise<void>;
  onAdd: (title: string) => Promise<boolean>;
  adding: boolean;
  focusTrigger?: number;
  todos: Todo[];
}> = ({ toggleAllActive, onToggleAll, onAdd, adding, focusTrigger, todos }) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          className={`todoapp__toggle-all ${toggleAllActive ? 'active' : ''}`}
          onClick={onToggleAll}
        />
      )}

      <NewTodoForm
        onAdd={onAdd}
        disabled={adding}
        focusTrigger={focusTrigger}
      />
    </header>
  );
};
