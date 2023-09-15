import React from "react";

import { cn } from '@/lib/utils';

type ContainerProps = {} & React.ComponentPropsWithRef<'div'>;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({
    children,
    className,
    ...rest
  },
    ref
  ) => {
    return (
      <div className={cn(
        'flex py-10 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-white border-opacity-10 bg-componentPrimary max-w-[800px] mx-auto',
        className
      )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

export default Container;