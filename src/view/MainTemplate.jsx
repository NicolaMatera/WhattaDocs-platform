import React from "react";
import Header from "./Header";

function MainTemplate({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}

export default MainTemplate;