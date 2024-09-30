import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart, url = '' } = useContext(StoreContext);

  // Kiểm tra nếu id và các thông tin khác hợp lệ
  if (!id || !name || !price || !image) {
    return <div>Thông tin sản phẩm không hợp lệ.</div>;
  }

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        
        {!cartItems[id] ? (
          <img 
            className='add' 
            onClick={() => addToCart(id)} 
            src={assets.add_icon_white} 
            alt="Add to Cart" 
          />
        ) : (
          <div className='food-item-counter'>
            <img 
              onClick={() => removeFromCart(id)} 
              src={assets.remove_icon_red} 
              alt="Remove from Cart" 
            />
            <p>{cartItems[id]}</p>
            <img 
              onClick={() => addToCart(id)} 
              src={assets.add_icon_green} 
              alt="Add More" 
            />
          </div>
        )}
      </div>
      
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating Stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default FoodItem;
