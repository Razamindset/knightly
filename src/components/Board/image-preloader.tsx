import Image from "next/image";
import { classificationIcons } from "@/app/review/board-icons";

const ImagePreloader = () => {
  return (
    <div style={{ display: "none" }}>
      {/* Preload classification icons */}
      {Object.values(classificationIcons).map((icon, index) =>
        // Check if icon.emoji is a string (for the 'null' case) or StaticImageData
        typeof icon.emoji === "string" ? null : (
          <Image
            key={`classification-${index}`}
            src={icon.emoji}
            alt=""
            width={1}
            height={1}
            priority={true}
          />
        )
      )}
    </div>
  );
};

export default ImagePreloader;
