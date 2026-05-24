import sedan from "@/assets/car-sedan.jpg";
import suv from "@/assets/car-suv.jpg";
import van from "@/assets/car-van.jpg";
import hatch from "@/assets/car-hatch.jpg";
import pickup from "@/assets/car-pickup.jpg";
import mpv from "@/assets/car-mpv.jpg";

export type Vehicle = {
  id: string;
  name: string;
  category: "Economy" | "Sedan" | "SUV" | "Van" | "Pickup" | "MPV";
  image: string;
  pricePerDay: number;
  transmission: "Automatic" | "Manual";
  seats: number;
  fuel: "Gasoline" | "Diesel";
  branch: "Taft, Manila" | "Antipolo, Rizal";
  available: boolean;
};

export const vehicles: Vehicle[] = [
  { id: "v1", name: "Toyota Wigo", category: "Economy", image: hatch, pricePerDay: 1000, transmission: "Manual", seats: 5, fuel: "Gasoline", branch: "Taft, Manila", available: true },
  { id: "v2", name: "Mitsubishi Mirage", category: "Economy", image: sedan, pricePerDay: 1200, transmission: "Automatic", seats: 5, fuel: "Gasoline", branch: "Taft, Manila", available: true },
  { id: "v3", name: "Toyota Vios", category: "Sedan", image: sedan, pricePerDay: 1800, transmission: "Automatic", seats: 5, fuel: "Gasoline", branch: "Antipolo, Rizal", available: true },
  { id: "v4", name: "Honda City", category: "Sedan", image: sedan, pricePerDay: 2000, transmission: "Automatic", seats: 5, fuel: "Gasoline", branch: "Taft, Manila", available: false },
  { id: "v5", name: "Toyota Rush", category: "SUV", image: suv, pricePerDay: 2500, transmission: "Automatic", seats: 7, fuel: "Gasoline", branch: "Antipolo, Rizal", available: true },
  { id: "v6", name: "Ford Everest", category: "SUV", image: suv, pricePerDay: 3200, transmission: "Automatic", seats: 7, fuel: "Diesel", branch: "Taft, Manila", available: true },
  { id: "v7", name: "Toyota Avanza", category: "MPV", image: mpv, pricePerDay: 2200, transmission: "Automatic", seats: 7, fuel: "Gasoline", branch: "Antipolo, Rizal", available: true },
  { id: "v8", name: "Toyota Innova", category: "MPV", image: mpv, pricePerDay: 2800, transmission: "Automatic", seats: 8, fuel: "Diesel", branch: "Taft, Manila", available: true },
  { id: "v9", name: "Nissan Urvan", category: "Van", image: van, pricePerDay: 3500, transmission: "Manual", seats: 15, fuel: "Diesel", branch: "Antipolo, Rizal", available: true },
  { id: "v10", name: "Toyota Hiace", category: "Van", image: van, pricePerDay: 4200, transmission: "Manual", seats: 15, fuel: "Diesel", branch: "Taft, Manila", available: true },
  { id: "v11", name: "Ford Ranger", category: "Pickup", image: pickup, pricePerDay: 3000, transmission: "Automatic", seats: 5, fuel: "Diesel", branch: "Antipolo, Rizal", available: true },
  { id: "v12", name: "Toyota Hilux", category: "Pickup", image: pickup, pricePerDay: 3300, transmission: "Automatic", seats: 5, fuel: "Diesel", branch: "Taft, Manila", available: false },
];

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
