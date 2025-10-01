"use client";

import { useState } from "react";

export default function Home() {
  const [trackerNumber, setTrackerNumber] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    if (!trackerNumber) return;

    setLoading(true);
    setResults([]);

    try {
      // Replace with your actual Google Sheet ID and sheet name
      const sheetId = "YOUR_SHEET_ID";
      const sheetName = "Sheet1";
      const url = `https://opensheet.vercel.app/${sheetId}/${sheetName}`;

      const res = await fetch(url);
      const data = await res.json();

      const [studentNum, code] = trackerNumber.split("-");

      // Get all matching records
      const matches = data.filter(
        (row) =>
          row["Student Number"] === studentNum &&
          row["First Name"].substring(0, 2).toUpperCase() === code.toUpperCase()
      );

      setResults(matches.length > 0 ? matches : [{ error: "No record found" }]);
    } catch (err) {
      console.error(err);
      setResults([{ error: "Error fetching data" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Student Status Tracker</h1>

      <input
        type="text"
        placeholder="Enter Tracker Number (e.g., 202512345-AN)"
        value={trackerNumber}
        onChange={(e) => setTrackerNumber(e.target.value)}
        className="border p-2 rounded w-80 mb-3"
      />

      <button
        onClick={fetchStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {results.length > 0 && (
        <div className="mt-6 w-full max-w-lg">
          {results[0]?.error ? (
            <p className="text-red-500">{results[0].error}</p>
          ) : (
            <div>
              <h2 className="font-semibold mb-3">Results:</h2>
              {results.map((entry, idx) => (
                <div
                  key={idx}
                  className="mb-3 p-4 border rounded shadow-sm bg-white"
                >
                  <p>
                    <strong>Student Number:</strong> {entry["Student Number"]}
                  </p>
                  <p>
                    <strong>Date of Submission:</strong>{" "}
                    {entry["Submission Date"]}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {entry["Status"] === "Approved" ? (
                      <span className="text-green-600">Approved ✅</span>
                    ) : (
                      <span className="text-red-600">Not Approved ❌</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
