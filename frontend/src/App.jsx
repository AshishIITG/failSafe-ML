import { useState } from "react";

function App() {

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

  // Handle input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });

  };

  // API call
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

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >

      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
        }}
      >

        <h1 style={{ textAlign: "center" }}>
          FAILSAFE
        </h1>

        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
          Student Risk Prediction
        </h3>

        {
          Object.keys(formData).map((key) => (

            <div key={key} style={{ marginBottom: "15px" }}>

              <label>{key}</label>

              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px"
                }}
              />

            </div>

          ))
        }

        <button
          onClick={handlePredict}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Predict
        </button>

        {
          prediction && (

            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor:
                  prediction === "At Risk"
                    ? "#fee2e2"
                    : "#dcfce7"
              }}
            >

              <h2>
                Prediction: {prediction}
              </h2>

              <h3>
                Risk Probability: {probability}
              </h3>

            </div>

          )
        }

      </div>

    </div>

  );

}

export default App;