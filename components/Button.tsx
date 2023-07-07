import Image from "next/image";
import { MouseEventHandler } from "react";

interface Props {
    title: string,
    leftIcon?: string | null,
    rightIcon?: string | null,
    handleClick?: MouseEventHandler,
    submitting?: boolean | false,
    type?: 'button' | 'submit',
    bgColor?: string,
    textColor?: string
}

const Button = ({ title, leftIcon, rightIcon, handleClick, submitting, type, bgColor, textColor }: Props) => (
    <button
        type={type || 'button'}
        disabled={submitting || false}
        className={`flexCenter gap-3 px-4 py-3 
        ${textColor ? textColor : 'text-white'} 
        ${submitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'} rounded-xl text-sm font-medium max-md:w-full`}
        onClick={handleClick}
    >
        {submitting && (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
            </>
            )}
        {leftIcon && <Image src={leftIcon} width={14} height={14} alt="left icon" />}
        {!submitting && title}
        {rightIcon && <Image src={rightIcon} width={14} height={14} alt="right icon" />}
    </button>
)

export default Button;