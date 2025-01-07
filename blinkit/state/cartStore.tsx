import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import { mmkvStorage } from "./storageMMkv";

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  getItemCount: (id: string | number) => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist((set, get) => ({
    cart:[],
    addItem:(item)=>{
      const currentCart = get().cart
      const existingIndex = currentCart.findIndex(cartItem => cartItem?._id === item?._id)
      if (existingIndex>=0){
        const updatedCart = [...currentCart]
        updatedCart[existingIndex]={
          ...updatedCart[existingIndex],
          count:updatedCart[existingIndex].count +1
        }
        set({cart:updatedCart})

      }else{
        set({
          cart:[...currentCart,{_id:item._id,item:item,count:1}]
        })
      }
    },
    clearCart:()=>set({cart:[]}),
    removeItem:(id)=>{

      const currentCart = get().cart
      const existingIndex = currentCart.findIndex(cartItem => cartItem?._id === id)
      if (existingIndex>=0){
        const updatedCart = [...currentCart]
        const existingitem =  updatedCart[existingIndex];
        if (existingitem.count>1){
          updatedCart[existingIndex] ={
            ...existingitem,
            count:existingitem?.count-1
          }

        }else{
          updatedCart.splice(existingIndex,1)

        }

        set({cart:updatedCart})
      }
      
    },
    getItemCount:(id)=>{
      const currentItemc=get().cart.find(cartitem=>cartitem._id ===id)
      return currentItemc ? currentItemc?.count :0
    },
    getTotalPrice:()=>{
      return get().cart.reduce((total,cartItem)=> total + cartItem.item.price * cartItem.count,0)

    }
  }), {
    name: "cart-storage",
    storage: createJSONStorage(() => mmkvStorage),
  })
);
