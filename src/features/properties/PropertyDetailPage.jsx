import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperty } from "../../api/properties.api";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    getProperty(id)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!property) return <p className="p-8">Loading...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">
        {property.title}
      </h1>
      <p className="mt-2">{property.description}</p>
      <p className="mt-2">Address: {property.address}</p>
      <p className="mt-2 font-bold">
        R{property.price_per_month}/month
      </p>
    </div>
  );
};

export default PropertyDetailPage;