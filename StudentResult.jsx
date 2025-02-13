import React, { useState } from "react";
import './src/App.css'; // Ensure this path is correct

export default function StudentResult() {
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDownload = async (type) => {
        // Validate the input field
        if (!search.trim()) {
            setError("Enrollment number cannot be empty.");
            return;
        }

        if (search.trim().length < 4) {
            setError("Enrollment number must be at least 4 characters.");
            return;
        }

        // Validate that the input contains only numbers
        if (!/^\d+$/.test(search.trim())) {
            setError("Enrollment number must contain only numbers.");
            return;
        }

        // Clear any previous errors
        setError("");

        // Start loading
        setLoading(true);

        try {
            const endpoint = type === "Certificate" 
                ? "https://scaitbackend.onrender.com/generate-certificate" 
                : "https://scaitbackend.onrender.com/generate-diploma";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentNumber: search }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate ${type}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error generating ${type}:`, error);
            alert(`Failed to generate the ${type}. Please try again.`);
        } finally {
            // Stop loading
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                    Student Result Portal
                </h1>
                <p className="text-lg text-gray-600">
                    Enter your enrollment number to download your certificate or diploma.
                </p>
            </div>

            {/* Search Input */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setError(""); // Clear error when typing
                    }}
                    placeholder="Enter enrollment number..."
                    className={`w-full p-3 border ${
                        error ? "border-red-500" : "border-gray-300"
                    } rounded-lg mb-2 text-gray-700 focus:outline-none focus:ring-2 ${
                        error ? "focus:ring-red-500" : "focus:ring-blue-500"
                    } focus:border-transparent transition-all`}
                />

                {/* Error Message */}
                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => handleDownload("Certificate")}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating Certificate...</span>
                            </div>
                        ) : (
                            "Download Certificate"
                        )}
                    </button>
                    <button
                        onClick={() => handleDownload("Diploma")}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating Diploma...</span>
                            </div>
                        ) : (
                            "Download Diploma"
                        )}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500">
                <p>© 2023 Student Academy. All rights reserved.</p>
            </div>
        </div>
    );
}