
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500';
const BASEURI = `${API_URL}/api/auth`;


export async function fetchJSON(BASE, path, options = {}) {
  let res = await fetch(`${BASE}${path}`, options);

  if (res.status === 401) {
    try {
      const refreshRes = await refreshToken();

      if (refreshRes.success) {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        const updatedUser = {
          ...storedUser,
          accessToken: refreshRes.accessToken
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${refreshRes.accessToken}`
        };

        res = await fetch(`${BASE}${path}`, options);
      } else {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (err) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message || "Request failed");
  }

  return res.json();
}

export async function login({ email, password }) {
  return fetchJSON(BASEURI, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup({ name, email, password }) {
  return fetchJSON(BASEURI, '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password })
  })
}

export const updateProfile = async (accessToken, formData) => {
  return fetchJSON(BASEURI, '/updateUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(formData)
  })
}

export async function refreshToken() {
  return fetchJSON(BASEURI, "/refresh", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include"
  })
}

export default {
  fetchJSON,
  login,
  signup
}


export const logout = async () => {
  return fetchJSON(BASEURI, '/logout', {
    method: 'POST',
    credentials: 'include',
  })
}

const itemBaseURI = `${API_URL}/api/product`;

export const addItems = async (accessToken, payload) => {
  return fetchJSON(itemBaseURI, "/add", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  })
}

export const updateItem = async (accessToken, payload, id) => {
  console.log("Updatin id", id);
  return fetchJSON(itemBaseURI, `/update/${id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  })
}

export const deleteItem = async (accessToken, id) => {
  return fetchJSON(itemBaseURI, `/delete/${id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    }
  })
}

export const myItems = async (accessToken, key = '') => {
  return fetchJSON(itemBaseURI, "/myproduct", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({ key })
  });
}

export const allItems = async (key = '') => {
  return fetchJSON(itemBaseURI, "/viewall", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
}

export const recentItems = async (page = 1, limit = 10) => {
  return fetchJSON(itemBaseURI, `/latest?page=${page}&limit=${limit}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' }
  })
}

export const mostFavItems = async (page = 1, limit = 10) => {
  return fetchJSON(itemBaseURI, ``)
}

export const mostViewedItems = async (page = 1, limit = 10) => {
  return fetchJSON(itemBaseURI, `/mostViewed?page=${page}&limit=${limit}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' }
  })
}

export const categoryItem = async (category, page = 1, limit = 10) => {
  return fetchJSON(itemBaseURI, `/${category}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' }
  }
  )
}

export const fetchProductData = async (id) => {
  return fetchJSON(itemBaseURI, `/edit/${id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export const toggleLike = async (accessToken, id) => {
  return fetchJSON(itemBaseURI, `/like/${id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    }
  });
}



export const getWishList = async (accessToken) => {
  return fetchJSON(itemBaseURI, '/user/wishlist', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`
    }
  })
}

// =====================================
// CART API
// =====================================
const cartBaseURI = `${API_URL}/api/cart`;

export const getCart = async (accessToken) => {
  return fetchJSON(cartBaseURI, '/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const addToCartAPI = async (accessToken, productId, qty = 1) => {
  return fetchJSON(cartBaseURI, '/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId, qty }),
  });
};

export const updateCartItemAPI = async (accessToken, productId, qty) => {
  return fetchJSON(cartBaseURI, '/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId, qty }),
  });
};

export const removeFromCartAPI = async (accessToken, productId) => {
  return fetchJSON(cartBaseURI, `/remove/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const clearCartAPI = async (accessToken) => {
  return fetchJSON(cartBaseURI, '/clear', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// =====================================
// ORDER API
// =====================================
const orderBaseURI = `${API_URL}/api/orders`;

export const placeOrderAPI = async (accessToken, { shippingAddress, paymentMethod }) => {
  return fetchJSON(orderBaseURI, '/place', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ shippingAddress, paymentMethod }),
  });
};

export const getMyOrdersAPI = async (accessToken, page = 1) => {
  return fetchJSON(orderBaseURI, `/my?page=${page}&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getOrderByIdAPI = async (accessToken, id) => {
  return fetchJSON(orderBaseURI, `/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const cancelOrderAPI = async (accessToken, id) => {
  return fetchJSON(orderBaseURI, `/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};