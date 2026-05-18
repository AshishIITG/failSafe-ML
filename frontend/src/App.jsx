import { useState } from "react";

function App() {

  const [showForm, setShowForm] = useState(false);

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

  // Handle input changes
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });

  };

  // Predict API
  const handlePredict = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/predict", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)

      });

      const data = await response.json();

      setPrediction(data.prediction);
      setProbability(data.probability);

    } catch (error) {

      console.error(error);

    }

  };


  // WELCOME PAGE
  if (!showForm) {

    return (

      <div
        style={{
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b, #2563eb)",
  color: "white",
  fontFamily: "'Inter', sans-serif",
  padding: "20px",
  overflow: "hidden",
  boxSizing: "border-box"
}}
      >

        <div
          style={{
  width: "100%",
  maxWidth: "950px",
  textAlign: "center",
  background: "rgba(255,255,255,0.08)",
  padding: "60px 50px",
  borderRadius: "28px",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0px 15px 50px rgba(0,0,0,0.35)"
}}
        >

          <h1
            style={{
  fontSize: "82px",
  fontWeight: "800",
  letterSpacing: "4px",
  marginBottom: "10px",
  lineHeight: "1",
  fontFamily: "'Poppins', sans-serif"
}}
          >
            FAILSAFE
          </h1>

          <h2
           style={{
  marginBottom: "28px",
  color: "#dbeafe",
  fontSize: "32px",
  fontWeight: "600",
  fontFamily: "'Inter', sans-serif"
}}
          >
            Predict Before Reality Hits 
          </h2>

          <p
            style={{
  fontSize: "18px",
  lineHeight: "1.9",
  color: "#e2e8f0",
  maxWidth: "760px",
  margin: "auto",
  fontWeight: "400"
}}
          >
            FAILSAFE is an AI-powered student risk prediction system.

            It analyzes study patterns, failures, attendance,
            and student behaviour to predict whether a student
            is academically safe or dangerously close to the
            legendary "bro I’m cooked" zone.
          </p>

          <p
            style={{
  marginTop: "28px",
  fontSize: "17px",
  color: "#bfdbfe",
  fontStyle: "italic",
  fontWeight: "300"
}}
          >
            Because sometimes students need intervention...
            before results intervene first.
          </p>

          <button
            onClick={() => setShowForm(true)}
            style={{
  marginTop: "45px",
  padding: "16px 42px",
  fontSize: "18px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #ffffff, #dbeafe)",
  color: "#1d4ed8",
  cursor: "pointer",
  fontWeight: "700",
  fontFamily: "'Inter', sans-serif",
  boxShadow: "0px 10px 30px rgba(37,99,235,0.35)",
  transition: "all 0.3s ease"
}}
          >
            Launch FAILSAFE 
          </button>

        </div>

      </div>

    );

  }


  // FORM PAGE
  return (

    <div
      style={{
  minHeight: "100vh",
  width: "100%",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b, #2563eb)",
  padding: "40px 20px",
  fontFamily: "'Inter', sans-serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box"
}}
    >

      <div
       style={{
  width: "100%",
  maxWidth: "700px",
  background: "rgba(255,255,255,0.08)",
  padding: "45px",
  borderRadius: "28px",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0px 15px 50px rgba(0,0,0,0.35)",
  color: "white"
}}
      >

        <h1 style={{
  textAlign: "center",
  fontSize: "42px",
  fontWeight: "700",
  marginBottom: "12px",
  color: "white",
  fontFamily: "'Poppins', sans-serif"
}}>
          Student Risk Form
        </h1>

        <p
          style={{
  textAlign: "center",
  color: "#cbd5e1",
  marginBottom: "35px",
  fontSize: "16px",
  lineHeight: "1.7"
}}
        >
          Fill student academic and behavioural details
        </p>

        {
          Object.keys(formData).map((key) => (

            <div key={key} style={{ marginBottom: "18px" }}>

              <label
                style={{
  fontWeight: "600",
  color: "#e2e8f0",
  fontSize: "15px"
}}
              >
                {key}
              </label>

              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box"
}}
              />

            </div>

          ))
        }

        <button
          onClick={handlePredict}
         style={{
  width: "100%",
  padding: "16px",
  background:
    "linear-gradient(135deg, #ffffff, #dbeafe)",
  color: "#1d4ed8",
  border: "none",
  borderRadius: "14px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "20px",
  fontFamily: "'Inter', sans-serif",
  boxShadow: "0px 10px 30px rgba(37,99,235,0.35)"
}}
        >
          Predict Student Risk
        </button>


        {
          prediction && (

            <div
              style={{
  marginTop: "30px",
  padding: "25px",
  borderRadius: "18px",
  background:
    prediction === "At Risk"
      ? "rgba(239,68,68,0.18)"
      : "rgba(34,197,94,0.18)",
  border:
    prediction === "At Risk"
      ? "1px solid rgba(239,68,68,0.4)"
      : "1px solid rgba(34,197,94,0.4)",
  backdropFilter: "blur(10px)"
}}
            >

              <h2>
                Prediction: {prediction}
              </h2>

              <h3>
                Risk Probability: {probability}
              </h3>

              <p>
                {
                  prediction === "At Risk"
                    ? "This student may need academic attention, mentoring, or intervention."
                    : "Student appears academically stable for now."
                }
              </p>

            </div>

          )
        }

      </div>

    </div>

  );

}

export default App;