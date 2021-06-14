import React from 'react';

const DeviceSelect = ({ devices, label, value, onChange, required }) => {
  React.useEffect(() => {
    onChange(devices[0].deviceId);
  }, []);

  return (
    <div>
      <label>
        {label}：
        <select
          value={value}
          required={required}
          onChange={(ev) => onChange(ev.target.value)}
        >
          {devices.map((it) => (
            <option key={it.deviceId} value={it.deviceId}>
              {it.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default DeviceSelect;
