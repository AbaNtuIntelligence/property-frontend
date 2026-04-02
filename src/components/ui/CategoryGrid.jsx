import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../services/propertyService'; // ONLY this line
import './CategoryGrid.css';

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/properties?category=${category.name.toLowerCase()}`);
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore by category</h2>
          <p>Find the perfect place that matches your style</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="category-icon">{category.icon}</span>
                </div>
              </div>
              
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <span className="category-count">{category.count} properties</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}