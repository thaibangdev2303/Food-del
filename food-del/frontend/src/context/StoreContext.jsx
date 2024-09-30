import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    if (!itemId) {
      console.error("Invalid product ID");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = { ...prev };

      if (!updatedCart[itemId]) {
        updatedCart[itemId] = 1; // Thêm sản phẩm mới với số lượng 1
      } else {
        updatedCart[itemId] += 1; // Tăng số lượng sản phẩm đã có
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    if (!itemId || !cartItems[itemId]) {
      console.error("Invalid product ID or product not in cart");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = { ...prev };

      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1; // Giảm số lượng sản phẩm
      } else {
        delete updatedCart[itemId]; // Xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 1
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Tính tổng giá trị giỏ hàng
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);

        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }

    return totalAmount;
  };

  // Lấy danh sách sản phẩm từ API
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Lấy dữ liệu giỏ hàng từ API
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      if (response.data && response.data.cartData) {
        setCartItems(response.data.cartData);
      } else {
        console.error("No cart data found");
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // useEffect để tải dữ liệu khi component được mount
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };

    loadData();
  }, []);

  // Giá trị context được truyền xuống các component con
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
