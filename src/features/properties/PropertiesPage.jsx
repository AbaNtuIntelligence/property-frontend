import { useEffect, useState } from "react";
import { getProperties } from "../../api/properties.api";
import { Link } from "react-router-dom";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties()
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {property.title}
            </h2>
            <p>{property.address}</p>
            <p className="font-bold mt-2">
              R{property.price_per_month}/month
            </p>

            <Link
              to={`/property/${property.id}`}
              className="text-blue-500 mt-3 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;