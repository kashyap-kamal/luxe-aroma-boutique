import React from "react";

interface LearnMoreButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

const LearnMoreButton = ({
  text = "Learn More",
  onClick,
  className = "",
}: LearnMoreButtonProps) => {
  return (
    <button
      className={`learn-more-button group relative inline-block cursor-pointer outline-none border-0 bg-transparent p-0 text-inherit font-inherit h-auto ${className}`}
      onClick={onClick}
    >
      <span
        className="circle relative block m-0 w-12 h-12 bg-black rounded-[1.625rem] transition-all duration-450 ease-bezier group-hover:w-full"
        aria-hidden="true"
      >
        <span className="icon arrow absolute top-0 bottom-0 my-auto left-[0.625rem] w-[1.125rem] h-[0.125rem] bg-transparent transition-all duration-450 ease-bezier group-hover:bg-white group-hover:translate-x-4 before:absolute before:content-[''] before:-top-[0.29rem] before:right-[0.0625rem] before:w-[0.625rem] before:h-[0.625rem] before:border-t-[0.125rem] before:border-r-[0.125rem] before:border-white before:rotate-45"></span>
      </span>
      <span className="button-text absolute top-0 left-0 right-0 bottom-0 py-3 px-0 m-0 pl-[2rem] whitespace-nowrap text-luxe-violet font-bold leading-[1.6] text-center uppercase transition-all duration-450 ease-bezier group-hover:text-white">
        {text}
      </span>
    </button>
  );
};

export default LearnMoreButton;
