import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollPageRestore() {
    const { pathname } = useLocation();


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
