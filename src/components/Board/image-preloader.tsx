import Image from "next/image";
import { classificationIcons } from "@/app/review/board-icons";

{/* Preload classification icons */}
const ImagePreloader = () => {
  return (
    <div style={{ display: "none" }}>
      {Object.values(classificationIcons).map((icon, index) => (
        <Image
          key={`classification-${index}`}
          src={icon.emoji}
          alt=""
          width={1}
          height={1}
          priority={true}
        />
      ))}
    </div>
  );
};

export default ImagePreloader;
