import { useEffect, useState } from "react";

import { HexAlphaColorPicker } from "react-colorful";

import { material as defaultColors } from "../../libs/colors.json";
import {
  DefaultColorStyle,
  DefaultColorThemePalette,
  DefaultDashStyle,
  DefaultFillStyle,
  DefaultFontFamilies,
  DefaultFontStyle,
  DefaultSizeStyle
} from "@tldraw/tldraw";

import { colord } from "colord";
import { getSettings, saveSettings } from "../../libs/storage";

import FillNoneIcon from "../../assets/icons/FillNoneIcon";
import FillPatternIcon from "../../assets/icons/FillPatternIcon";
import FillSemiIcon from "../../assets/icons/FillSemiIcon";
import FillSolidIcon from "../../assets/icons/FillSolidIcon";

const paletteColorNames = [
  "red", "green", "blue", "orange", "violet", "light-red",
  "light-green", "light-blue", "yellow", "light-violet", "grey", "black"
];

const shapeSizeValues = ["s", "m", "l", "xl"];
const borderStyleValues = ["solid", "dashed", "dotted", "draw"];
const fillStyleValues = ["none", "solid", "semi", "pattern"];
const fontStyleValues = ["draw", "mono", "sans", "serif"];

const borderStyleIcons = [
  "horizontal_rule",
  "unknown_med",
  "more_horiz",
  "line_curve"
];

const fillStyleIcons = [
  FillNoneIcon,
  FillSolidIcon,
  FillSemiIcon,
  FillPatternIcon
];

/**
 *
 * @param {Object} param0
 * @param {import("@tldraw/tldraw").Editor} param0.editor
 * @returns
 */
function StylePanel({ editor }) {
  const [colors, setColors] = useState(() => {
    const saved = getSettings().customColors;
    return saved && saved.length === defaultColors.length ? saved : [...defaultColors];
  });
  const [activeColor, setActiveColor] = useState(undefined);
  const [shapeSize, setShapeSize] = useState(shapeSizeValues[0]);
  const [borderStyle, setBorderStyle] = useState(borderStyleValues[0]);
  const [fillStyle, setFillStyle] = useState(fillStyleValues[0]);
  const [fontStyle, setFontStyle] = useState("sans");
  const [isOpen, setIsOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [hexInput, setHexInput] = useState("");

  useEffect(() => {
    upateDefaultPalette();
  }, []);

  // Sync hex input when active color changes
  useEffect(() => {
    if (activeColor) setHexInput(activeColor);
  }, [activeColor]);

  // Colors
  useEffect(() => {
    if (activeColor === undefined) return;

    const colorIndex = colors.findIndex((clr) => clr === activeColor);
    const colorName = paletteColorNames[colorIndex];

    upateDefaultPalette();

    applyStyle(DefaultColorStyle, colorName);
  }, [activeColor]);

  // Size
  useEffect(() => applyStyle(DefaultSizeStyle, shapeSize), [shapeSize]);

  // Border style
  useEffect(() => applyStyle(DefaultDashStyle, borderStyle), [borderStyle]);

  // Fill style
  useEffect(() => applyStyle(DefaultFillStyle, fillStyle), [fillStyle]);

  // Font style
  useEffect(() => applyStyle(DefaultFontStyle, fontStyle), [fontStyle]);

  const applyStyle = (style, value) => {
    if (editor.isIn("select")) editor.setStyleForSelectedShapes(style, value);

    editor.setStyleForNextShapes(style, value);

    blinkStyle();
  };

  const blinkStyle = () => {
    const selectedIds = editor.selectedShapeIds;

    if (selectedIds.length === 0) return;

    editor.selectNone();

    setTimeout(() => editor.select(...selectedIds), 500);
  };

  const onColorChange = (color) => {
    const newPalette = colors.map((prevColor) =>
      prevColor === activeColor ? color : prevColor
    );

    setColors([...newPalette]);
    setActiveColor(color);
    saveSettings({ ...getSettings(), customColors: newPalette });
  };

  const upateDefaultPalette = () => {
    DefaultFontFamilies.sans = "'sans-serif', monospace";
    for (let i = 0; i < paletteColorNames.length; i++) {
      const name = paletteColorNames[i];
      const color = colors[i];

      const solid = color;
      const semi = colord(color).lighten(0.25).toHex();

      // Dark
      DefaultColorThemePalette.darkMode[name].solid = solid;
      DefaultColorThemePalette.darkMode[name].semi = semi;
      DefaultColorThemePalette.darkMode[name].pattern = semi;
      // Light
      DefaultColorThemePalette.lightMode[name].solid = solid;
      DefaultColorThemePalette.lightMode[name].semi = semi;
      DefaultColorThemePalette.lightMode[name].pattern = semi;
    }
  };

  const resetColors = () => {
    if (!window.confirm("Reset colors to defaults? Custom colors will be lost.")) return;
    setColors([...defaultColors]);
    setActiveColor(undefined);
    saveSettings({ ...getSettings(), customColors: undefined });
    upateDefaultPalette();
  };

  const onHexInputChange = (ev) => {
    const value = ev.target.value;
    setHexInput(value);
    if (colord(value).isValid() && activeColor) {
      onColorChange(value);
    }
  };

  const updateShapeSize = (ev) => {
    const size = ev.currentTarget.dataset.size;
    setShapeSize(size);
  };

  const updateBorderStyle = (ev) => {
    const style = ev.currentTarget.dataset.style;
    setBorderStyle(style);
  };

  const updateFillStyle = (ev) => {
    const style = ev.currentTarget.dataset.style;
    setFillStyle(style);
  };

  const updateFontStyle = (ev) => {
    const style = ev.currentTarget.dataset.style;
    setFontStyle(style);
  };

  const toggleStylePanel = () => setIsOpen(!isOpen);

  return (
    <div className="container style-panel">
      <button
        className="style-panel__toggler material-symbols-rounded"
        alt="Toggle formatter"
        data-isactive={isOpen}
        onClick={toggleStylePanel}
      >
        format_paint
      </button>

      <div className="style-panel__content">
        <section>
          <div className="color-section__header">
            <h2>Color</h2>
            <button
              className="material-symbols-rounded"
              title="Reset colors to defaults"
              onClick={resetColors}
            >
              restart_alt
            </button>
          </div>
          <div className="style-panel__section__content">
            <div className="color-palette">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-palette__color small"
                  style={{ color }}
                  data-isactive={activeColor === color}
                  onClick={() => setActiveColor(color)}
                ></button>
              ))}
            </div>
            <HexAlphaColorPicker color={activeColor} onChange={onColorChange} />
            <button
              className="advanced-color-toggle"
              data-isopen={advancedOpen}
              onClick={() => setAdvancedOpen(!advancedOpen)}
            >
              <span className="material-symbols-rounded">chevron_right</span>
              Hex input
            </button>
            {advancedOpen && (
              <div className="advanced-color-inputs">
                <label>Hex</label>
                <input
                  type="text"
                  value={hexInput}
                  onChange={onHexInputChange}
                  placeholder="#000000"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2>Shape size</h2>
          <div className="style-panel__section__content equal-size">
            {shapeSizeValues.map((val, idx) => (
              <button
                key={val}
                className="material-symbols-rounded small"
                onClick={updateShapeSize}
                data-isactive={val === shapeSize}
                data-size={val}
                title={val}
              >
                pen_size_{idx + 1}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Border style</h2>
          <div className="style-panel__section__content equal-size">
            {borderStyleValues.map((val, idx) => (
              <button
                key={val}
                className="material-symbols-rounded small"
                onClick={updateBorderStyle}
                data-isactive={val === borderStyle}
                data-style={val}
                title={val}
              >
                {borderStyleIcons[idx]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Fill style</h2>
          <div className="style-panel__section__content equal-size">
            {fillStyleValues.map((val, idx) => (
              <button
                className="small"
                key={val}
                onClick={updateFillStyle}
                data-isactive={val === fillStyle}
                data-style={val}
                title={val}
              >
                {fillStyleIcons[idx]()}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Font style</h2>
          <div className="style-panel__section__content equal-size">
            {fontStyleValues.map((val) => (
              <button
                key={val}
                className="small"
                onClick={updateFontStyle}
                data-isactive={val === fontStyle}
                data-style={val}
                title={val}
              >
                <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <text
                    fill="currentColor"
                    fontSize="21"
                    y="20"
                    fontFamily={`tldraw_${val}, sans-serif`}
                  >
                    Aa
                  </text>
                </svg>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default StylePanel;
