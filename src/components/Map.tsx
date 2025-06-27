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
        title="Google Map location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.5171707545696!2d76.21097682441983!3d10.076560523832848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08110007d4586b%3A0x1a4c5bdfdc2a6e3c!2sAnatomy%20Family%20Fitness%20Centre!5e0!3m2!1sen!2sin!4v1751014477642!5m2!1sen!2sin"
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
