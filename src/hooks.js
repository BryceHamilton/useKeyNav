import { useState, useEffect } from 'react';

export function useWrapped(range, disabled = [], initialValue) {
  const actualInitVal = disabled.includes(initialValue) ? null : initialValue;
  const [current, setCurrent] = useState(actualInitVal);

  const allDisabled = disabled.length === range;
  const lastIdx = range - 1;

  const isNull = val => val == null;
  const wrap = val => (val + range) % range;
  const isDisabled = idx => disabled.includes(idx);

  const getNextEnabled = (val, delta) => {
    if (allDisabled) return null;
    let nextIdx = wrap(val + delta);
    while (isDisabled(nextIdx)) nextIdx = wrap(nextIdx + delta);
    return nextIdx;
  };

  const inc = () => setCurrent(c => (isNull(c) ? 0 : getNextEnabled(c, 1)));
  const dec = () =>
    setCurrent(c => (isNull(c) ? lastIdx : getNextEnabled(c, -1)));
  const reset = () => setCurrent(initialValue);

  return [current, { inc, dec, reset }];
}

export function useKeyNav(isOpen, { up, down, reset }, shouldSave) {
  const keyMap = { ArrowUp: up, ArrowDown: down };

  const handleKeydown = ev => {
    ev.preventDefault();
    const action = keyMap[ev.code];
    action(ev);
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      if (!shouldSave) reset();
      window.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen]);
}

export function useDropdownNav({
  isOpen,
  range,
  disabled,
  initialValue,
  shouldSave
}) {
  const [current, setters] = useWrapped(range, disabled, initialValue);
  const { inc, dec, reset } = setters;

  useKeyNav(isOpen, { up: dec, down: inc, reset }, shouldSave);

  return current;
}
