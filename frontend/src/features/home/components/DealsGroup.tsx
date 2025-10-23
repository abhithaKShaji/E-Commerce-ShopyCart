import React from "react";

interface Deal {
  image: string;
  name: string;
  highlight: string;
  offer: string;
}

interface DealsGroupProps {
  title: string;
  deals: Deal[];
}

const DealsGroup: React.FC<DealsGroupProps> = ({ title, deals }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {deals.map((item) => (
          <div
            key={item.name}
            className="bg-gray-50 rounded-md p-3 hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-36 object-contain mb-2"
            />
            <h3 className="text-gray-800 text-sm font-medium">{item.name}</h3>
            {item.highlight && (
              <p className="text-green-600 text-xs font-semibold">
                {item.highlight}
              </p>
            )}
            <p className="text-green-700 text-sm font-bold">{item.offer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsGroup;
