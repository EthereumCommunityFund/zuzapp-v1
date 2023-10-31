import { LucideIcon } from "lucide-react";
import * as React from "react";
import { IconType } from "react-icons";
import { ImSpinner2 } from "react-icons/im";

import { cn } from "@/lib/utils";

const ButtonVariant = [
  "primary",
  "outline",
  "ghost",
  "light",
  "dark",
  "blue",
  "quiet",
  "red",
  "primaryGreen",
  "strongerGreen",
  "yellow",
  "quiet-SM",
] as const;
const ButtonSize = ["sm", "base", "lg"] as const;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      size = "base",
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "inline-flex items-center font-medium",
          "focus-visible:ring-primary focus:outline-none focus-visible:ring",
          "shadow-sm",
          "transition-colors duration-200",
          //#region  //*=========== Size ===========
          [
            size === "base" && ["px-3 py-1.5", "text-sm"],
            size === "sm" && ["px-2 py-1", "text-xs md:text-sm"],
            size === "lg" && [
              "px-4 py-2",
              "text-xl font-sans font-semibold md:text-lg",
            ],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === "primary" && [
              "bg-btnPrimary/20 text-[#FFFFFF]",
              "border",
              "hover:bg-btnPrimary/30",
            ],
            variant === "outline" && [
              "text-primary",
              "border-primary border",
              "hover:bg-primary active:bg-primary/10 disabled:bg-primary/10",
              isDarkBg &&
                "hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800",
            ],
            variant === "ghost" && [
              "text-primary-500",
              "shadow-none",
              "hover:bg-primary/5 active:bg-primary/10 disabled:bg-primary/10",
              isDarkBg &&
                "hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800",
            ],
            variant === "primaryGreen" && [
              "bg-btnPrimaryGreen/20 text-btnPrimaryGreen",
              "hover:bg-btnPrimaryGreen/30",
              "rounded-[20px]",
            ],
            variant === "strongerGreen" && [
              "bg-btnStrongerGreen text-white",
              "hover:bg-btnStrongerGreenHover",
              "rounded-[20px]",
            ],
            variant === "quiet" && [
              "bg-white/5 text-white",
              "hover:bg-white/10",
            ],
            variant === "blue" && [
              "bg-btnBlue/20",
              "text-btnBlue",
              "hover:bg-opacity-30",
            ],
            variant === "yellow" && [
              "bg-btnYellow/20 text-btnYellow",
              "rounded-[20px]",
              "hover:bg-opacity-30",
            ],
            variant === "red" && [
              "bg-btnRed/20 ",
              "text-btnRed",
              "hover:bg-opacity-30",
            ],
            variant === "quiet-SM" && ["bg-btnQuietSM", "hover:bg-[#434545]"],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          isLoading &&
            "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white": ["primary", "dark"].includes(variant),
                "text-black": ["light"].includes(variant),
                "text-primary-500": ["outline", "ghost"].includes(variant),
              }
            )}
          >
            <ImSpinner2 className="animate-spin" />
          </div>
        )}
        {LeftIcon && (
          <div
            className={cn([
              size === "base" && "mr-1",
              size === "sm" && "mr-1.5",
              size === "lg" && "mr-2",
            ])}
          >
            <LeftIcon
              size="1em"
              className={cn(
                [
                  size === "base" && "md:text-md text-md",
                  size === "sm" && "md:text-md text-sm",
                ],
                classNames?.leftIcon
              )}
            />
          </div>
        )}

        {children}
        {RightIcon && (
          <div
            className={cn([
              size === "base" && "ml-1",
              size === "sm" && "ml-1.5",
              size === "lg" && "ml-2",
            ])}
          >
            <RightIcon
              size="1.25em"
              className={cn(
                [
                  size === "base" && "text-md md:text-md",
                  size === "sm" && "md:text-md text-sm",
                ],
                classNames?.rightIcon
              )}
            />
          </div>
        )}
      </button>
    );
  }
);

export default Button;
