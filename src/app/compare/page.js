"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the IDs from the URL (e.g., ?ids=1,2)
  const ids = searchParams.get("ids");

  useEffect(() => {
    if (ids) {
      fetchComparedColleges(ids.split(","));
    } else {
      setLoading(false);
    }
  }, [ids]);

  async function fetchComparedColleges(idArray) {
    // Fetch only the specific colleges the user selected
    let { data, error } = await supabase
      .from("colleges")
      .select("*")
      .in("id", idArray);

    if (error) console.error("Error fetching comparison data:", error);
    else setColleges(data);
    setLoading(false);
  }

  if (loading) return <div className="p-10 text-center text-black">Loading comparison...</div>;
  if (!ids || colleges.length === 0) return <div className="p-10 text-center text-black">No colleges selected to compare.</div>;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Back to Search
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">College Comparison</h1>

        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl">
          <table className="w-full text-left text-black">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 w-1/4">Feature</th>
                {colleges.map(c => (
                  <th key={c.id} className="p-4 font-bold text-lg">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600">Location</td>
                {colleges.map(c => <td key={c.id} className="p-4">{c.location}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600">Fees (per year)</td>
                {colleges.map(c => <td key={c.id} className="p-4 text-red-600 font-medium">₹{c.fees.toLocaleString()}</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600">Placement %</td>
                {colleges.map(c => <td key={c.id} className="p-4 text-green-600 font-medium">{c.placement_rate}%</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600">Rating</td>
                {colleges.map(c => <td key={c.id} className="p-4 font-medium">{c.rating} / 5.0</td>)}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600 align-top">Top Courses</td>
                {colleges.map(c => (
                  <td key={c.id} className="p-4">
                    <ul className="list-disc pl-4 space-y-1">
                      {c.courses.map((course, i) => <li key={i}>{course}</li>)}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}