
import React from "react";
import { FaUsers } from "react-icons/fa"; 

interface CountBoxProps {
  icon?: React.ReactNode; 
  count: number | string;
  label: string;
}

const CountBox: React.FC<CountBoxProps> = ({ icon = <FaUsers />, count, label }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
      <div className="text-3xl text-pink-500">{icon}</div>
      <div>
        <h3 className="text-xl font-bold">{count}</h3>
        <span className="text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default CountBox;
