import { assets } from "@/assets/assets";

const Hero = () => {
  return (
    <div className="flex sm:flex-row flex-col border border-gray-400 h-[450px]">
      <div className="flex justify-center items-center px-14 py-10 sm:py-0 w-full sm:w-1/2">
       <div className="text-[#414141]">
          <p className="bg-[#414141] w-8 md:w-11 h-[2px]"></p>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm md:text-base uppercase">Découvrez notre collection</p>
          </div>
          <h1 className="sm:py-3 text-3xl lg:text-5xl leading-relaxed prata-regular">
            <span className="text-[#414141]">Style élégant, prix imbattables</span>
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-orange-400 text-sm md:text-base uppercase">Achetez maintenant</p>
            <p className="bg-[#414141] w-8 md:w-11 h-[1px]"></p>
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-1/2 overflow-hidden">
        <img
          src={`/hero_img.png`}
          alt="Attractive sales image"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
       
      </div>
    </div>
  );
};

export default Hero;
