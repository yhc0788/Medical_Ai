import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaApple,
  FaWeixin,
  FaTrash,
  FaGlobe,
  FaDownload,
  FaShareAlt,
} from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

const languageOptions = [
  { lang: "Eng", flag: "🇺🇸" },
  { lang: "한", flag: "🇰🇷" },
  { lang: "日", flag: "🇯🇵" },
  { lang: "中", flag: "🇨🇳" },
];

const waitingMessages = [
  "Analysis in progress...",
  "Please wait a moment...",
  "Detailed analysis takes some time...",
  "Stretch your back!",
  "10 seconds can improve your health!",
  "Slowly rotate your shoulders!",
];

const socialLogins = [
  { icon: FaGoogle, text: "Google", bg: "bg-blue-500" },
  { icon: FaApple, text: "Apple", bg: "bg-black" },
  { icon: SiKakaotalk, text: "Kakao", bg: "bg-yellow-400 text-black" },
  { icon: SiNaver, text: "Naver", bg: "bg-green-600" },
  { icon: FaWeixin, text: "WeChat", bg: "bg-green-400" },
];

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resultPending, setResultPending] = useState(false);
  const [showAnalysisScreen, setShowAnalysisScreen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [waitingMessage, setWaitingMessage] = useState(waitingMessages[0]);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  useEffect(() => {
    if (resultPending) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % waitingMessages.length;
        setWaitingMessage(waitingMessages[index]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [resultPending]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    setError(newFiles.length ? "" : "Invalid file type or size exceeded (10MB max). ");
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = () => {
    alert("PDF Download not implemented");
  };

  const handleShareResult = () => {
    alert("Share Result not implemented");
  };

  const handleUpload = () => {
    if (!files.length) {
      return setError("Please upload files.");
    }
    setUploading(true);
    setResultPending(true);
    setShowAnalysisScreen(true);

    // 10초 후 분석 완료(테스트용)
    setTimeout(() => {
      setUploading(false);
      setResultPending(false);
      setShowAnalysisScreen(false);
      setAnalysisResult({
        title: "Possible Pneumonia Detected",
        confidence: 85,
        recommendation: "We recommend you visit a pulmonologist for further examination.",
      });
    }, 10000);
  };

  return (
    // 전체 화면 중앙 정렬
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        {/* 대기 화면 */}
        {showAnalysisScreen && !analysisResult ? (
          <motion.div
            className="text-center text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {waitingMessage}
          </motion.div>
        ) : (
          <>
            {/* 헤더 영역 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Medical Quick Analysis</h2>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 transition-all"
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                >
                  <FaGlobe className="text-xl" />
                  {language.flag} {language.lang}
                </button>
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg overflow-hidden">
                    {languageOptions.map(({ lang, flag }) => (
                      <button
                        key={lang}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
                        onClick={() => {
                          setLanguage({ lang, flag });
                          setIsLanguageOpen(false);
                        }}
                      >
                        {flag} {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 본문 */}
            {analysisResult ? (
              // 분석 결과 카드 (Fade+Slide)
              <motion.div
                className="p-4 border rounded bg-gray-50 shadow mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-red-600">
                  {analysisResult.title}
                </h3>
                <p className="mt-2">Confidence: {analysisResult.confidence}%</p>
                <p className="mt-1">{analysisResult.recommendation}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded"
                    onClick={handleDownloadPDF}
                  >
                    <FaDownload /> PDF
                  </button>
                  <button
                    className="bg-green-500 text-white flex items-center gap-2 px-4 py-2 rounded"
                    onClick={handleShareResult}
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </motion.div>
            ) : (
              // 업로드 화면
              <>
                <p className="text-gray-600 text-center my-4">Upload your files for analysis.</p>
                <label className="p-4 border-dashed border-2 border-gray-400 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-all block w-full">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf,.dicom"
                    className="hidden"
                  />
                  <p className="text-gray-600">Drag & Drop or Click</p>
                </label>
                <ul className="grid grid-cols-1 gap-2 my-4 w-full">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-2 border rounded text-sm w-full"
                    >
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      <button
                        className="text-red-500"
                        onClick={() => removeFile(idx)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpload}
                  className="w-full bg-blue-500 text-white mt-4 px-4 py-2 rounded"
                  disabled={!files.length || uploading}
                >
                  {uploading ? "Uploading..." : "Start Analysis"}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </>
            )}

            {/* SNS 간편 가입 */}
            <div className="flex justify-center gap-4 mt-8">
              {socialLogins.map(({ icon: Icon, text, bg }) => (
                <button
                  key={text}
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${bg} text-white`}
                >
                  <Icon className="text-2xl" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
