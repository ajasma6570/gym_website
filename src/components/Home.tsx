"use client";

import { GiBiceps } from "react-icons/gi";
import { RiTimerFlashLine } from "react-icons/ri";
import { FaBicycle } from "react-icons/fa";
import Image from "next/image";
import Map from "./Map";

const ChooseOurGym = [
  {
    icon: <GiBiceps className="h-16 w-16 text-red-600" />,
    title: "Best Training",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy",
  },
  {
    icon: <RiTimerFlashLine className="h-16 w-16 text-red-600" />,
    title: "Quality Equipment",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy",
  },
  {
    icon: <GiBiceps className="h-16 w-16 text-red-600" />,
    title: "nutrition plan",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy",
  },
  {
    icon: <FaBicycle className="h-16 w-16 text-red-600" />,
    title: "Personal Training",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy",
  },
];

const trainers = [
  {
    name: "John Smith",
    title: "Strength & Conditioning",
    image: "/assets/eq_1.jpeg",
    description:
      "Certified personal trainer with 8+ years of experience in strength training and muscle building.",
  },
  {
    name: "Sarah Johnson",
    title: "Yoga & Flexibility",
    image: "/assets/eq_2.jpeg",
    description:
      "Yoga instructor specializing in flexibility, mindfulness, and holistic wellness approaches.",
  },
  {
    name: "Mike Davis",
    title: "CrossFit & HIIT",
    image: "/assets/eq_3.jpeg",
    description:
      "High-intensity training expert focused on functional fitness and athletic performance.",
  },
];
export default function Home() {
  return (
    <div className="min-h-screen">
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage:
            "url('/assets/cross-training-rope-swing-exercise.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <h1 className="text-3xl md:text-6xl lg:text-6xl uppercase font-bold mb-6">
              Push harder today
            </h1>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6 uppercase">
              If You Want a Different
              <br /> Tomorrow
            </p>
            <p className="text-base text-white/90 mb-8 max-w-3xl">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      <div className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase">
              Push your limits forward
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold">
              Achieve amazing results <br /> with our services
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
          {ChooseOurGym.map((item, index) => (
            <div
              key={item.title + index}
              className="text-center p-6  rounded-lg shadow-md"
            >
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-left min-h-screen flex flex-col justify-center items-center ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full w-full">
          <div className="h-full w-full flex items-center justify-center">
            <Image
              src="/assets/anatomy.jpeg"
              alt="Cross Training Rope Swing Exercise"
              width={520}
              height={600}
              className="object-cover rounded-3xl"
              style={{ width: "520px", height: "600px" }}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-center items-start p-8 space-y-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase text-white">
              why choose us
            </h2>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6 uppercase">
              Our complex has
              <br /> the best trainers
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy
            </p>

            <ul className="list-disc pl-5  text-xl space-y-2">
              <li>Personal Training</li>
              <li>Group Training</li>
            </ul>

            <a
              href="#"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>

      <div className=" mx-auto  text-center min-h-screen flex flex-col justify-center items-center ">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
          <div className="h-full w-full flex flex-col justify-center bg-[#1a1919] items-center p-8 space-y-10">
            <p className="text-xl font-normal text-center">
              Experience the Difference
            </p>
            <p className="text-2xl xl:leading-16 md:text-4xl xl:text-5xl font-bold text-red-600 mb-6 uppercase">
              Designed to Achieve <br /> Peak Performance
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              At our fitness center, we combine innovative training methods with
              expert guidance to help you reach your goals. Whether you are just
              starting out or looking to push beyond your limits, we have got
              you covered.
            </p>
          </div>{" "}
          <div className="h-full w-full flex items-center justify-center">
            <Image
              src="/assets/image5.jpg"
              alt="Cross Training Rope Swing Exercise"
              width={520}
              height={600}
              className="object-cover  h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Our Trainers Section */}
      <div className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase text-white">
              Meet Our Team
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold">
              Expert Trainers <br /> Ready to Guide You
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div
                key={trainer.name + index}
                className="bg-[#1a1919] rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-64 bg-gray-300 flex items-center justify-center">
                  <Image
                    src={trainer.image}
                    alt="Trainer 1"
                    width={300}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                  <p className="text-red-600 font-medium mb-3">
                    {trainer.title}
                  </p>
                  <p className="text-neutral-400 text-sm">
                    {trainer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
            >
              Book a Session
            </a>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className=" pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase text-gray-400">
              Find Us
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold mb-4">
              Visit Our Location
            </p>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Located in the heart of the city with easy access and ample
              parking. Come visit us today for a tour of our facilities!
            </p>
          </div>
        </div>

        <Map />
      </div>
    </div>
  );
}
