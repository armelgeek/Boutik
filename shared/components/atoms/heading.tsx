const Heading = ({ text1, text2 , className,  children}: { text1: string; text2?: string, className?: string, children?: React.ReactNode }) => {
  return (
     <div className={`${className ? className : 'text-center'} text-3xl`}>
        <div className="inline-flex items-center gap-2 mb-3 uppercase">
        <p className="text-orange-500">
            {text1} <span className="font-medium text-gray-700">{text2}</span>
        </p>
        <p className="bg-gray-700 w-8 sm:w-12 h-[1px] sm:h-[2px]"></p>
        </div>
        <p className="m-auto w-3/4 text-gray-600 text-xs sm:text-sm md:text-base">
            {children}
        </p>
   </div>
  );
};
export default Heading;
