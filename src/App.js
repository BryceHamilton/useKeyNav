import { useState } from 'react';
import { useDropdownNav } from './hooks';

function App() {
  const items = [1, 2, 3, 4, 5, 6];
  const disabledIdices = [3];

  const [isOpen, setIsOpen] = useState(false);

  const currentIdx = useDropdownNav({
    isOpen,
    range: items.length,
    disabled: disabledIdices,
    initialValue: 2,
    shouldSave: true
  });

  const toggleOpen = () => setIsOpen(isOpen => !isOpen);

  const fade = { color: isOpen ? '' : 'grey' };
  const openMessage = isOpen ? 'close' : 'open';

  const highlight = idx => {
    if (!isOpen || disabledIdices.includes(idx)) {
      return { color: 'grey' };
    } else if (currentIdx === idx) {
      return { color: 'red' };
    }
    return {};
  };

  return (
    <div>
      <p>Key Nav Dropdown</p>
      <button onClick={toggleOpen}>{openMessage}</button>
      <div style={fade}>
        {items.map((item, idx) => (
          <div style={highlight(idx)}>{item}</div>
        ))}
      </div>
    </div>
  );
}
export default App;
