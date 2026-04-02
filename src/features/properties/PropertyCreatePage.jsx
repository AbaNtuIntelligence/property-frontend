import { useState } from "react";
import API from "../../api/axios";

const PropertyCreatePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    price_per_month: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) =>
      formData.append(key, form[key])
    );

    await API.post("properties/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Property Created");
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4">
      <input name="title" placeholder="Title" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="price_per_month" placeholder="Price" onChange={handleChange} />
      <input type="file" name="image" onChange={handleChange} />
      <button className="bg-black text-white p-2">Create</button>
    </form>
  );
};

export default PropertyCreatePage;