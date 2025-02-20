import { assets } from "@/assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border h-[450px]  border-gray-400 ">
      <div className="w-full sm:w-1/2 px-14 flex items-center justify-center py-10 sm:py-0">
       <div className="text-[#414141]">
          <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm md:text-base uppercase">Découvrez notre collection</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            <span className="text-[#414141]">Style élégant, prix imbattables</span>
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base uppercase">Achetez maintenant</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/2 relative overflow-hidden">
        <img
          src={`/hero_img.png`}
          alt="Attractive sales image"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-md">
          Offre spéciale
        </div>
      </div>
    </div>
  );
};

export default Hero;
