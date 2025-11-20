import React from "react";

export default function FormInput({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: any) {
  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1 text-gray-700">{label}</label>

      <div className="flex items-center border rounded-xl p-2 gap-3 bg-white shadow-sm">
        {icon}
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className="outline-none bg-transparent w-full text-gray-700"
        />
      </div>

      {error && touched && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
