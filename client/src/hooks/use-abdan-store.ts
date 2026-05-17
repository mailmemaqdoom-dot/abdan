import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, SIZES, type Product } from "@/data/abdan";

export type CartItem = {
  productId: string;
  name: string;
  priceLabel: string;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

const CART_STORAGE_KEY = "abdan-cart-v1";
const THEME_STORAGE_KEY = "abdan-theme";

function parsePrice(priceLabel: string) {
  const numeric = Number(priceLabel.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function getInitialCart() {
  if (typeof window === "undefined") return [] as CartItem[];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [] as CartItem[];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as CartItem[];
  }
}

export function getInitialTheme() {
  if (typeof window === "undefined") return "light" as const;
  return (window.localStorage.getItem(THEME_STORAGE_KEY) as "light" | "dark" | null) ??
    "light";
}

export function useAbdanStore() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>(() => getInitialCart());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[1]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isCartOpen, setCartOpen] = useState(false);
  const [isProductOpen, setProductOpen] = useState(false);
  const [isPaymentVisible, setPaymentVisible] = useState(false);
  const [pendingCheckoutItem, setPendingCheckoutItem] = useState<CartItem | null>(null);
  const [activeTeaser, setActiveTeaser] = useState<"loyalty" | "community" | null>(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return PRODUCTS;
    return PRODUCTS.filter((product) => product.primaryTag === activeFilter);
  }, [activeFilter]);

  const totals = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + parsePrice(item.priceLabel) * item.quantity, 0);
    return {
      itemCount,
      total,
      formattedTotal: `₹${total.toLocaleString("en-IN")}`,
    };
  }, [cart]);

  useEffect(() => {
    if (isCartOpen || !pendingCheckoutItem) return;

    const checkoutProduct = PRODUCTS.find((product) => product.id === pendingCheckoutItem.productId);
    if (!checkoutProduct) {
      setPendingCheckoutItem(null);
      return;
    }

    setSelectedProduct(checkoutProduct);
    setSelectedSize(pendingCheckoutItem.size);
    setSelectedColor(pendingCheckoutItem.color);
    setProductOpen(true);
    setPaymentVisible(true);
    setPendingCheckoutItem(null);
  }, [isCartOpen, pendingCheckoutItem]);

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedSize(SIZES[1]);
    setSelectedColor(product.color.split(" and ")[0]?.trim() ?? product.color);
    setPaymentVisible(false);
    setProductOpen(true);
  }

  function closeProduct() {
    setProductOpen(false);
    setPaymentVisible(false);
  }

  function addToCart() {
    if (!selectedProduct || !selectedSize || !selectedColor) {
      return { ok: false, message: "Please select size and colour first." } as const;
    }

    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.productId === selectedProduct.id &&
          item.size === selectedSize &&
          item.color === selectedColor,
      );

      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      return [
        ...current,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          priceLabel: selectedProduct.priceLabel,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
          image: selectedProduct.image,
        },
      ];
    });

    return { ok: true, message: "Added to your bag." } as const;
  }

  function updateQuantity(index: number, delta: number) {
    setCart((current) => {
      const next = [...current];
      const item = next[index];
      if (!item) return current;
      const quantity = item.quantity + delta;
      if (quantity <= 0) {
        next.splice(index, 1);
        return next;
      }
      next[index] = { ...item, quantity };
      return next;
    });
  }

  function removeFromCart(index: number) {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function checkoutFromCart() {
    if (!cart.length) return false;

    const firstItem = cart[0];
    if (!firstItem) return false;

    setPendingCheckoutItem(firstItem);
    setCartOpen(false);
    return true;
  }

  return {
    activeFilter,
    setActiveFilter,
    filteredProducts,
    cart,
    totals,
    isCartOpen,
    setCartOpen,
    selectedProduct,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    isProductOpen,
    openProduct,
    closeProduct,
    addToCart,
    updateQuantity,
    removeFromCart,
    isPaymentVisible,
    setPaymentVisible,
    checkoutFromCart,
    activeTeaser,
    setActiveTeaser,
  };
}
