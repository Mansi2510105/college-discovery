"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Search, MapPin, IndianRupee, Star, Check, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [feeFilter, setFeeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 3; // Number of items per page
  const router = useRouter();

  useEffect(() => {
    fetchColleges(0, true);
  }, [feeFilter]); // Re-fetch when filter changes

  async function fetchColleges(pageNumber, reset = false) {
    setLoading(true);
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("colleges")
      .select("*", { count: 'exact' })
      .range(from, to);

    // Apply Fee Filter Logic
    if (feeFilter === "low") query = query.lt("fees", 200000);
    if (feeFilter === "mid") query = query.gte("fees", 200000).lte("fees", 400000);
    if (feeFilter === "high") query = query.gt("fees", 400000);

    const { data, count, error } = await query;

    if (error) {
      console.error(error);
    } else {
      if (reset) {
        setColleges(data);
      } else {
        setColleges((prev) => [...prev, ...data]);
      }
      setHasMore(count > (reset ? 0 : colleges.length) + data.length);
    }
    setLoading(false);
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchColleges(nextPage);
  };

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((cid) => cid !== id));
    } else {
      if (compareIds.length >= 3) return alert("Max 3 colleges");
      setCompareIds([...compareIds, id]);
    }
  };

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <h1 className="text-4xl font-bold text-gray-900 text-black">SmartEd Discovery</h1>
          <button
            onClick={() => router.push('/predictor')}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition"
          >
            🎯 Try Predictor Tool
          </button>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search colleges..."
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white appearance-none text-black"
                value={feeFilter}
                onChange={(e) => {
                  setFeeFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">All Fees</option>
                <option value="low">Under ₹2 Lakh</option>
                <option value="mid">₹2 Lakh - ₹4 Lakh</option>
                <option value="high">Above ₹4 Lakh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h2>
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <p className="flex items-center gap-2"><MapPin size={16} /> {college.location}</p>
                <p className="flex items-center gap-2 text-green-600 font-semibold"><IndianRupee size={16} /> ₹{college.fees.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/college/${college.id}`)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => toggleCompare(college.id)}
                  className={`flex-1 border py-2 rounded-lg font-medium transition ${compareIds.includes(college.id) ? "bg-green-100 border-green-500 text-green-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {compareIds.includes(college.id) ? "Added" : "Compare"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination: Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-white border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Colleges"}
            </button>
          </div>
        )}
      </div>

      {/* Comparison Floating Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 animate-bounce-in">
          <span>{compareIds.length} college(s) selected</span>
          <button
            onClick={() => router.push(`/compare?ids=${compareIds.join(",")}`)}
            className="bg-blue-600 px-4 py-1.5 rounded-full font-bold hover:bg-blue-500"
          >
            Compare Now
          </button>
        </div>
      )}
    </main>
  );
}