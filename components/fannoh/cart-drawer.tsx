"use client";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  LogIn,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCart, removeFromCart, updateQuantity } from "@/store/slices/cartSlice";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen, totalAmount } = useAppSelector((state) => state.cart);
  const { user, loading } = useAppSelector((state) => state.auth);

  const shipping = 0;
  const total = totalAmount + shipping;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => dispatch(toggleCart(open))} direction="right">
      <DrawerContent className="h-full sm:max-w-110">
        <DrawerHeader className="border-b border-border/50 px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <DrawerClose asChild>
              <button
                type="button"
                className="sm:hidden p-1.5 -ml-1.5 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </DrawerClose>
            <div>
              <DrawerTitle className="font-serif text-2xl">Cart</DrawerTitle>
              <DrawerDescription>
                {items.reduce((acc, item) => acc + item.quantity, 0)} items
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="mt-4 text-primary hover:underline text-sm"
                >
                  Continue Shopping
                </button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base text-foreground font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="font-medium text-foreground text-sm shrink-0">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground mt-1 mb-3 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                          }
                          className="p-1.5 hover:bg-muted fannoh-transition rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                          className="p-1.5 hover:bg-muted fannoh-transition rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1.5 text-muted-foreground hover:text-destructive fannoh-transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="border-t border-border/50 px-4 sm:px-6 py-4 sm:py-6 gap-4">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? "Free"
                    : `KES ${Number(shipping).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-medium text-foreground pt-2 border-t border-border/50">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <DrawerClose asChild>
              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 fannoh-transition text-center block"
              >
                Checkout
              </Link>
            </DrawerClose>

            <DrawerClose asChild>
              <button
                type="button"
                className="w-full border border-border text-foreground py-4 rounded-full font-medium hover:bg-muted fannoh-transition"
              >
                Continue Shopping
              </button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
