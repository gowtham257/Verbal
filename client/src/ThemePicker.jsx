import { useState } from "react";

function ThemePicker({ theme, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-picker">
      <button
        type="button"
        className="theme-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Edit background and font colors"
        title="Edit background and font colors"
      >
        🖌️
      </button>

      {open && (
        <div className="theme-popover">
          <div className="field">
            <label htmlFor="bgColor">Background</label>
            <input
              id="bgColor"
              type="color"
              value={theme.bg}
              onChange={(e) => onChange({ ...theme, bg: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="textColor">Font</label>
            <input
              id="textColor"
              type="color"
              value={theme.text}
              onChange={(e) => onChange({ ...theme, text: e.target.value })}
            />
          </div>
          <button type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default ThemePicker;
