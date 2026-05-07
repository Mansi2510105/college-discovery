"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, Target, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PredictorPage() {
  const [rank, setRank] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .gte("cutoff_rank", parseInt(rank)) 
      .order("cutoff_rank", { ascending: true });

    if (error) console.error(error);
    else setResults(data);
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-6 font-medium">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">College Predictor</h1>
          </div>
          
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter your JEE / Entrance Rank</label>
              <input
                type="number"
                required
                placeholder="e.g. 15000"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              {loading ? "Calculating..." : "Predict My Colleges"}
            </button>
          </form>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Colleges for You:</h2>
            {results.map((college) => (
              <div key={college.id} className="bg-white p-6 rounded-xl border border-green-200 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{college.name}</h3>
                  <p className="text-gray-600 text-sm">{college.location} • Cutoff: ~{college.cutoff_rank}</p>
                </div>
                <button 
                  onClick={() => router.push(`/college/${college.id}`)}
                  className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                  Details <GraduationCap size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {rank && results.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-10">No colleges found for this rank. Try a different input.</p>
        )}
      </div>
    </main>
  );
}