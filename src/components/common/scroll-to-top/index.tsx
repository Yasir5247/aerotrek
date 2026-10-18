"use client";

import useScrollTop from "@/hooks/use-scroll-top";

const ScrollToTop = () => {
    const { stick, onClickHandler } = useScrollTop();
    if (stick) {
        return (
            <button
                aria-label="Scroll to top"
                type="button"
                className="fixed bottom-[30px] right-[30px] z-[999] flex h-[50px] w-[50px] items-center justify-center rounded-full border-0 bg-[#111] text-lg text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition hover:bg-[#5a5a5a]"
                onClick={onClickHandler}
            >
                <i className="fa fa-angle-double-up"></i>
            </button>
        );
    }
    return null;
};

export default ScrollToTop;
