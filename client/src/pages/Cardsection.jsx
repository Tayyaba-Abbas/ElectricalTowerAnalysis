import React from "react";
import '../styles/Cardsection.css'
const CardsSection = () => {
  return (
    <div className="flex justify-center gap-6 mt-28">
      <div className="w-72 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center text-lg font-semibold">
        Card 1
      </div>
      <div className="w-72 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center text-lg font-semibold">
        Card 2
      </div>
      <div className="w-72 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center text-lg font-semibold">
        Card 3
      </div>
    </div>
  );
};

export default CardsSection;
