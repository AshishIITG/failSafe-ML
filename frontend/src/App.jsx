/* eslint-disable */

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

function App() {
  const [page, setPage] = useState("welcome");

  const [formData, setFormData] = useState({
    age: 18,
    Medu: 4,
    Fedu: 4,
    traveltime: 2,
    studytime: 3,
    failures: 0,
    famrel: 4,
    freetime: 3,
    goout: 2,
    Dalc: 1,
    Walc: 1,
    health: 5,
    absences: 2
  });

  const [prediction, setPrediction] = useState("");
  const [probability, setProbability] = useState("");
  const [reasons, setReasons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  // NEW: State to handle the loading animation while Celery processes
  const [isPredicting, setIsPredicting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to pause execution for a given time
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // UPDATED: Asynchronous Polling API Call
  const handlePredict = async () => {
    setIsPredicting(true); // Start loading state

    try {
      // Step 1: Send data and get the task ID instantly
      const initialResponse = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const initialData = await initialResponse.json();
      const taskId = initialData.task_id;

      // Step 2: Poll the task-status endpoint every 2 seconds
      let taskComplete = false;
      while (!taskComplete) {
        const statusResponse = await fetch(`http://127.0.0.1:8000/task-status/${taskId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === "Complete") {
          // Task is finished! Extract results.
          setPrediction(statusData.result.prediction);
          setProbability(statusData.result.probability);
          setReasons(statusData.result.reasons);
          setRecommendations(statusData.result.recommendations);
          
          fetchHistory(); // Refresh the history chart
          taskComplete = true; // Break the loop
        } else {
          // Task still processing, wait 2 seconds before asking again
          await sleep(2000);
        }
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsPredicting(false); // Stop loading state
    }
  };


  useEffect(() => {
    fetchHistory();
  }, []);

  const fieldLabels = {
    age: "Age",
    Medu: "Mother's Education",
    Fedu: "Father's Education",
    traveltime: "Travel Time",
    studytime: "Study Time",
    failures: "Previous Failures",
    famrel: "Family Relationship",
    freetime: "Free Time",
    goout: "Social Activity",
    Dalc: "Workday Alcohol Consumption",
    Walc: "Weekend Alcohol Consumption",
    health: "Health Status",
    absences: "Absences"
  };

  // =========================
  // WELCOME PAGE
  // =========================
  if (page === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-14 items-center min-h-[85vh]">
            
            {/* LEFT SIDE */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm mb-6">
                AI-Powered Student Analytics
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
                FAILSAFE
              </h1>
              <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-blue-200">
                Predict Before Reality Hits 📉
              </h2>
              <p className="mt-8 text-slate-300 text-lg leading-8 max-w-xl">
                FAILSAFE uses machine learning to detect
                students who may be academically at risk -
                before report cards start causing emotional damage.
              </p>
              <p className="mt-5 text-slate-400 leading-7 max-w-lg">
                Analyze attendance, study patterns, failures,
                and student behaviour using AI-driven prediction models.
              </p>
              <button
                onClick={() => setPage("login")}
                className="mt-10 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:scale-105 transition duration-300 shadow-2xl"
              >
                Launch FAILSAFE 🚀
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-300 text-sm">
                      Student Risk Status
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                      AI Monitoring
                    </h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    📊
                  </div>
                </div>

                <div className="mt-10 space-y-5">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">
                        Attendance
                      </span>
                      <span className="text-green-400 font-bold">
                        Stable
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">
                        Study Behaviour
                      </span>
                      <span className="text-yellow-400 font-bold">
                        Moderate Risk
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-slate-300">
                        Academic Prediction
                      </span>
                      <span className="text-red-400 font-bold">
                        AI Evaluating...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600">
                  <p className="text-sm text-blue-100">
                    ML Accuracy
                  </p>
                  <h1 className="text-5xl font-black mt-2">
                    93%
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (page === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-white">
          <h1 className="text-4xl font-black text-center">
            Faculty Login
          </h1>
          <p className="text-slate-300 text-center mt-3">
            Access FAILSAFE Dashboard
          </p>

          <div className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Faculty Email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />
            <button
              onClick={() => setPage("dashboard")}
              className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold hover:scale-[1.02] transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD PAGE
  // =========================
  const chartData = [
    { name: "Risk", value: probability * 100 },
    { name: "Safe", value: 100 - (probability * 100) }
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  const totalPredictions = history.length;
  const riskCount = history.filter(item => item.prediction === "At Risk").length;
  const safeCount = history.filter(item => item.prediction === "Safe").length;
  const avgRisk = history.length
    ? (history.reduce((acc, item) => acc + item.probability, 0) / history.length).toFixed(2)
    : 0;

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.reasons.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" ? true : item.prediction === filterType;
    return matchesSearch && matchesFilter;
  });

  const analyticsData = [
    { name: "Safe", count: safeCount },
    { name: "At Risk", count: riskCount }
  ];

  if (page === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 py-10 px-6 lg:px-12 text-white">
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">
          <div className="text-center">
            <h1 className="text-5xl font-black">FAILSAFE Predictor</h1>
            <p className="mt-4 text-slate-300">Fill student academic details for AI risk analysis</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-10">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm text-slate-300 mb-2 capitalize">
                  {fieldLabels[key]}
                </label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400 transition"
                />
              </div>
            ))}
          </div>

          {/* UPDATED SUBMIT BUTTON TO HANDLE LOADING STATE */}
          <button
            onClick={handlePredict}
            disabled={isPredicting}
            className={`w-full mt-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg transition duration-300 ${
              isPredicting ? "opacity-60 cursor-wait" : "hover:scale-[1.02]"
            }`}
          >
            {isPredicting ? "AI is processing data... please wait ⏳" : "Predict Student Risk"}
          </button>

          {prediction && !isPredicting && (
            <div
              className={`mt-8 p-6 rounded-2xl border backdrop-blur-lg ${
                prediction === "At Risk"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-green-500/10 border-green-500/30"
              }`}
            >
              <h2 className="text-3xl font-bold">Prediction: {prediction}</h2>
              <p className="mt-3 text-lg text-slate-300">Risk Probability: {probability}</p>
              
              <div className="mt-5">
                <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <li
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI INTERVENTIONS */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recommended Interventions</h3>
                <div className="space-y-3">
                  {recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-5 py-4 text-blue-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* PIE CHART */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-6">Risk Visualization</h3>
                <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        label
                        paddingAngle={3}
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PREDICTION HISTORY */}
          <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="Search AI insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none text-black"
              >
                <option value="All">All</option>
                <option value="Safe">Safe</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Total Predictions</p>
                <h1 className="text-3xl font-black mt-2">{totalPredictions}</h1>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <p className="text-red-300 text-sm">At Risk</p>
                <h1 className="text-3xl font-black mt-2 text-red-400">{riskCount}</h1>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                <p className="text-green-300 text-sm">Safe Students</p>
                <h1 className="text-3xl font-black mt-2 text-green-400">{safeCount}</h1>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                <p className="text-blue-300 text-sm">Avg Risk</p>
                <h1 className="text-3xl font-black mt-2 text-blue-400">
                  {(avgRisk * 100).toFixed(0)}%
                </h1>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
              <h2 className="text-2xl font-bold mb-6">Faculty Risk Analytics</h2>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Prediction History</h2>
            <div className="space-y-4">
              {filteredHistory.slice().reverse().map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{item.prediction}</h3>
                    <span className="text-blue-300">
                      {(item.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-3 text-slate-300">{item.reasons}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;