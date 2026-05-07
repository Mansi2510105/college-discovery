"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, MapPin, IndianRupee, Star, BookOpen, Briefcase } from "lucide-react";

export default function CollegeDetail() {
  const { id } = useParams(); // Gets the ID from the URL
  const router = useRouter();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCollegeDetails();
  }, [id]);

  async function fetchCollegeDetails() {
    let { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", id)
      .single(); // Gets just one object instead of an array

    if (error) console.error("Error fetching details:", error);
    else setCollege(data);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading details...</div>;
  if (!college) return <div className="min-h-screen flex items-center justify-center text-gray-600">College not found.</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{college.name}</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{college.description}</p>
          
          <div className="flex flex-wrap gap-6 border-t pt-6">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="text-blue-500" /> <span className="font-medium">{college.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <IndianRupee className="text-green-500" /> <span className="font-medium">₹{college.fees.toLocaleString()} / yr</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="text-yellow-500" /> <span className="font-medium">{college.rating} / 5.0 Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Courses Section */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Courses Offered</h2>
            </div>
            <ul className="space-y-3">
              {college.courses.map((course, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {course}
                </li>
              ))}
            </ul>
          </div>

          {/* Placements Section */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="text-green-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Placements</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-40 bg-green-50/50 rounded-xl border border-green-100">
              <span className="text-5xl font-extrabold text-green-600 mb-2">{college.placement_rate}%</span>
              <span className="text-gray-600 font-medium">Placement Success Rate</span>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Based on recent graduation data and recruitment drives.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}