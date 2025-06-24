"use client";

import {
  FaCodepen,
  FaInstagram,
  FaDribbble,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const guides = [
  {
    name: "Al Pacino",
    className: "card0",
    image:
      "https://i.pinimg.com/736x/8f/a0/51/8fa051251f5ac2d0b756027089fbffde--terry-o-neill-al-pacino.jpg",
  },
  {
    name: "Ben Stiller",
    className: "card1",
    image:
      "https://i.pinimg.com/originals/28/d2/e6/28d2e684e7859a0dd17fbd0cea00f8a9.jpg",
  },
  {
    name: "Patrick Stewart",
    className: "card2",
    image:
      "https://i.pinimg.com/originals/ee/85/08/ee850842e68cfcf6e3943c048f45c6d1.jpg",
  },
];

export default function Guides() {
  return (
    <div className="w-screen h-screen max-w-[1280px] max-h-[800px] min-w-[1000px] min-h-[600px] mx-auto flex justify-around items-center">
      {guides.map((guide, idx) => (
        <div
          key={idx}
          className={`relative h-[379px] w-[300px] bg-black rounded-[10px] overflow-hidden shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] transition-all duration-500 group`}
          style={{
            backgroundImage: `url(${guide.image})`,
            backgroundSize: "300px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}>
          <div className="absolute h-[369px] w-[290px] top-[5px] left-[5px] rounded-[10px] transition-all duration-700 group-hover:border group-hover:border-white">
            <h2 className="text-white font-sans text-xl mt-5 ml-5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {guide.name}
            </h2>
            <div className="absolute top-[226px] left-1/2 -translate-x-1/2 text-white h-[130px] w-[50px] flex flex-col justify-around items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <FaCodepen />
              <FaInstagram />
              <FaDribbble />
              <FaTwitter />
              <FaFacebook />
            </div>
          </div>
          {/* Expand image on hover */}
          <div
            className="absolute inset-0 transition-all duration-700 group-hover:bg-left"
            style={{
              backgroundImage: `url(${guide.image})`,
              backgroundSize: "600px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              zIndex: -1,
            }}
          />
        </div>
      ))}
    </div>
  );
}
