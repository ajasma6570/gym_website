import React from "react";

export default function Map({
  width = "w-full",
  height = "450",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div className={width}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2460.197809806285!2d4.5561772764958635!3d51.93034537971838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c432b5bc521259%3A0x860b774399753c6c!2sfitness%20america!5e0!3m2!1sen!2sin!4v1748802449203!5m2!1sen!2sin"
        width="100%"
        height={height}
        style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      ></iframe>
    </div>
  );
}
