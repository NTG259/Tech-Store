import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorPage from "./Error";

export default function RouteError() {
    const err = useRouteError();

    let message = "Đã xảy ra lỗi. Vui lòng thử lại.";

    if (isRouteErrorResponse(err)) {
        message = `${err.status} ${err.statusText || ""}`.trim();
    } else if (err instanceof Error && err.message) {
        message = err.message;
    } else if (typeof err === "string") {
        message = err;
    }

    return <ErrorPage message={message} />;
}