export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: "KG" | "Set" | "Piece" | "Bundle";
  rate: number;
}

export interface BillItem {
  productId: string;
  name: string;
  kg: number;
  sets: number;
  rate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNo: string;
  date: string;
  customerName: string;
  customerMobile: string;
  items: BillItem[];
  total: number;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: "admin" | "staff";
}
