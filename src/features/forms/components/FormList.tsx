import React from "react";
import { useForms } from "../hooks/useForms";
import { Link } from "react-router-dom";

export const FormsList: React.FC = () => {
  const { data, isLoading, isError } = useForms();

  if (isLoading)
    return <div className="p-4 text-gray-700">Loading forms...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Failed to load forms.</div>;
  if (!data || data.length === 0)
    return <div className="p-4">No forms found.</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((form) => (
        <Link
          key={form.nodeId}
          to={`/forms/${form.nodeId}`}
          className="p-4 border rounded hover:bg-gray-100 block"
        >
          <div className="font-bold">{form.name}</div>
          <div>{form.fieldCount} fields</div>
        </Link>
      ))}
    </div>
  );
};
