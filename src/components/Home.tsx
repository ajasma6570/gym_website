"use client";

import { GiBiceps } from "react-icons/gi";
import { RiTimerFlashLine } from "react-icons/ri";
import { FaBicycle } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import Image from "next/image";
import Map from "./Map";

const ChooseOurGym = [
  {
    icon: <GiBiceps className="h-16 w-16 text-red-600" />,
    title: "Best Training",
    description:
      "Get access to the best training programs designed to help you reach your fitness goals. Our certified trainers guide you with proven methods that ensure results.",
  },
  {
    icon: <RiTimerFlashLine className="h-16 w-16 text-red-600" />,
    title: "Quality Equipment",
    description:
      "We offer state-of-the-art fitness equipment to provide a safe and effective workout experience. Maintain perfect form and push your limits with confidence.",
  },
  {
    icon: <FaBowlFood className="h-14 w-14 text-red-600" />,
    title: "nutrition plan",
    description:
      "Fuel your fitness journey with personalized nutrition plans tailored to your body type and goals. Get expert guidance to complement your workouts.",
  },
  {
    icon: <FaBicycle className="h-16 w-16 text-red-600" />,
    title: "Personal Training",
    description:
      "Experience the benefits of personalized attention through one-on-one training sessions. Maximize your progress with customized workout routines.",
  },
];

const trainers = [
  {
    name: "Power Rack",
    title: "Strength & Conditioning",
    image: "/images/eq_1.webp",
    description:
      "Heavy-duty power rack with adjustable safety bars and pull-up bar, ideal for squats, bench press, and full-body strength workouts.",
  },
  {
    name: "Yoga Mats & Blocks",
    title: "Yoga & Flexibility",
    image: "/images/eq_2.webp",
    description:
      "High-grip yoga mats and foam blocks for enhanced comfort, support, and alignment during stretching and flexibility routines.",
  },
  {
    name: "CrossFit Setup",
    title: "CrossFit & HIIT",
    image: "/images/eq_3.webp",
    description:
      "Complete CrossFit station with battle ropes, plyo boxes, kettlebells, and medicine balls built for high-intensity circuits and endurance.",
  },
];
export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/rope-swing.webp"
          alt="Man training with rope swing"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Foreground Content */}
        <div className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-10 sm:px-0 text-left">
            <h1 className="text-3xl md:text-6xl lg:text-6xl uppercase font-bold mb-6">
              Train with Purpose
            </h1>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6 uppercase">
              If You Want a Different
              <br /> Tomorrow
            </p>
            <p className="text-base text-white/90 mb-8 max-w-3xl">
              Anatomy Family Fitness Centre in Nayarambalam, Vypin, Kochi offers
              expert training, modern equipment, and personalized fitness plans
              to help you get stronger
            </p>
            <a
              href="#"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-16 md:pb-0 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase">
              Why Choose Anatomy Gym in Kochi
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold">
              Achieve Amazing Results with Our Fitness Programs
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
              priority
              fetchPriority="high"
              src="/images/image4.webp"
              alt="Cross Training Rope Swing Exercise"
              width={520}
              height={600}
              className="object-cover rounded-3xl"
              style={{ width: "520px", height: "600px" }}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-center items-start p-8 space-y-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase text-white">
              Why Choose Anatomy Family Fitness Centre in Vypin
            </h2>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6 uppercase">
              Top Trainers & Best Gym Equipment in Kochi
            </p>
            <p>
              Located in Nayarambalam, Vypin – Anatomy Gym offers certified
              personal training, advanced equipment, and custom workout plans to
              help you reach peak performance.
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
              priority
              fetchPriority="high"
              src="/images/image5.webp"
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
              Gym Equipment at Anatomy Fitness - Nayarambalam , Vypin , Kochi
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold">
              High-Performance Machines for Every Fitness Goal
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
                    priority
                    fetchPriority="high"
                    src={trainer.image}
                    alt="Trainer 1"
                    width={300}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
                  <p className="text-red-500 font-bold mb-3 text-xl">
                    {trainer.title}
                  </p>
                  <p className="text-neutral-200 text-md">
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
            <h2 className="text-xl md:text-2xl font-semibold mb-4 uppercase ">
              Gym Location - Nayarambalam, Vypin
            </h2>
            <p className="text-3xl lg:text-4xl text-red-600 max-w-2xl mx-auto font-extrabold mb-4">
              Visit Our Gym in Kochi
            </p>
            <p className="text-gray-300 max-w-4xl  mx-auto">
              Anatomy Family Fitness Centre is conveniently located in
              Nayarambalam, Vypin, Kochi. Easily accessible from all major areas
              with ample parking and modern facilities. Book a tour and see why
              we’re the best gym near you!
            </p>
          </div>
        </div>

        <Map />
      </div>
    </div>
  );
}
