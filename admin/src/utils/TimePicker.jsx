/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const TimePicker = ({ onChange, value, className = "" }) => {
  // Parse initial value if provided in HH:MM:SS format
  const parseTime = (timeString) => {
    if (!timeString) return ["00", "00", "00"];
    const [h, m, s] = timeString.split(":").map((v) => v.padStart(2, "0"));
    return [h || "00", m || "00", s || "00"];
  };

  const [hours, setHours] = useState(parseTime(value)[0]);
  const [minutes, setMinutes] = useState(parseTime(value)[1]);
  const [seconds, setSeconds] = useState(parseTime(value)[2]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const [h, m, s] = parseTime(value);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [value]);

  const handleChange = (value, setter, max, type) => {
    let numericValue = value.replace(/\D/g, "");
    numericValue = Math.min(Math.max(0, parseInt(numericValue) || 0), max);
    const formattedValue = numericValue.toString().padStart(2, "0");

    let newHours = hours;
    let newMinutes = minutes;
    let newSeconds = seconds;

    if (type === "hours") newHours = formattedValue;
    if (type === "minutes") newMinutes = formattedValue;
    if (type === "seconds") newSeconds = formattedValue;

    setter(formattedValue);
    onChange?.(`${newHours}:${newMinutes}:${newSeconds}`);
  };

  const generateOptions = (max) =>
    Array.from({ length: max + 1 }, (_, i) => (
      <option key={i} value={i.toString().padStart(2, "0")}>
        {i.toString().padStart(2, "0")}
      </option>
    ));

  const TimeSelect = ({ value, onChange, max, type }) => (
    <select
      className="w-14 bg-transparent text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
      value={value}
      onChange={(e) => onChange(e.target.value, type)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {generateOptions(max)}
    </select>
  );

  return (
    <div className={`w-fit ${className}`}>
      <div
        className={`
        flex items-center gap-1 px-3 py-2 rounded-md
        border transition-all duration-200 bg-white
        ${focused ? "border-blue-500" : "border-gray-200"}
      `}
      >
        <Clock
          size={14}
          className={`${focused ? "text-blue-500" : "text-gray-400"}`}
        />

        <TimeSelect
          value={hours}
          onChange={(value) => handleChange(value, setHours, 99, "hours")}
          max={99}
          type="hours"
        />
        <span className="text-gray-300">:</span>

        <TimeSelect
          value={minutes}
          onChange={(value) => handleChange(value, setMinutes, 59, "minutes")}
          max={59}
          type="minutes"
        />
        <span className="text-gray-300">:</span>

        <TimeSelect
          value={seconds}
          onChange={(value) => handleChange(value, setSeconds, 59, "seconds")}
          max={59}
          type="seconds"
        />
      </div>
    </div>
  );
};

export default TimePicker;
