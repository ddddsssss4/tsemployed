import React, { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const PronunciationAssessment = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Azure Speech Service Configuration
  const subscriptionKey = "YOUR_SPEECH_KEY";
  const serviceRegion = "YOUR_REGION"; // e.g., "eastus"
  const deploymentId = "YOUR_CUSTOM_MODEL_ID"; // Your custom model ID from Azure
  const referenceText = "apple"; // Word or phrase to evaluate

  // Function to handle file upload and evaluate pronunciation
  const handleFileUpload = async (event) => {
    setLoading(true);
    setResult(null);
    setError("");

    const file = event.target.files[0];
    if (!file) {
      setError("Please upload an audio file.");
      setLoading(false);
      return;
    }

    try {
      // Configure Speech SDK
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        subscriptionKey,
        serviceRegion
      );

      // Set the custom model deployment ID
      speechConfig.endpointId = deploymentId;

      // Configure audio input
      const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(file);

      // Configure Pronunciation Assessment
      const pronConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON({
        referenceText,
        gradingSystem: "HundredMark", // Grading system
        granularity: "Phoneme", // Evaluation granularity
        enableMiscue: true,
      });

      // Create a recognizer
      const recognizer = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      pronConfig.applyTo(recognizer);

      // Perform recognition and evaluation
      recognizer.recognizeOnceAsync((recognitionResult) => {
        if (recognitionResult.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const resultJson = recognitionResult.properties.getProperty(
            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
          );
          setResult(JSON.parse(resultJson));
        } else {
          setError("Failed to recognize speech. Please try again.");
        }
        setLoading(false);
      });
    } catch (err) {
      setError("An error occurred while processing the audio file.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pronunciation Assessment</h2>
      <input
        type="file"
        accept=".wav"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Evaluating pronunciation...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>Assessment Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PronunciationAssessment;

