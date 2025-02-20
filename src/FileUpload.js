// FileUpload.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaApple,
  FaWeixin,
  FaTrash,
  FaDownload,
  FaShareAlt,
  FaChevronDown,
} from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

const i18n = {
  Eng: {
    title: "Medical Quick Analysis",
    uploadText: "Upload your files for analysis.",
    startAnalysis: "Start Analysis",
    analysisTitle: "Possible Pneumonia Detected",
    confidence: "Confidence",
    recommendation:
      "We recommend you visit a pulmonologist for further examination.",
    errorNoFile: "Please upload files.",
  },
  한: {
    title: "간편 의료 분석",
    uploadText: "분석을 위해 파일을 업로드하세요.",
    startAnalysis: "분석 시작",
    analysisTitle: "폐렴 가능성 감지",
    confidence: "정확도",
    recommendation: "호흡기내과 방문을 권장합니다.",
    errorNoFile: "파일을 업로드 해주세요.",
  },
  日: {
    title: "簡易医療分析",
    uploadText: "分析のためにファイルをアップロードしてください。",
    startAnalysis: "分析開始",
    analysisTitle: "肺炎の可能性が検出されました",
    confidence: "確信度",
    recommendation: "呼吸器内科への受診をおすすめします。",
    errorNoFile: "ファイルをアップロードしてください。",
  },
  中: {
    title: "简易医疗分析",
    uploadText: "请上传文件以进行分析。",
    startAnalysis: "开始分析",
    analysisTitle: "可能检测到肺炎",
    confidence: "置信度",
    recommendation: "建议您前往呼吸内科进行进一步检查。",
    errorNoFile: "请上传文件。",
  },
};

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

  // 현재 선택된 언어
  const [language, setLanguage] = useState(languageOptions[0]);
  const currentText = i18n[language.lang];

  // 드롭다운
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 다크 모드
  const [darkMode, setDarkMode] = useState(false);

  // 다크 모드 적용
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isLanguageOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageOpen]);

  // 대기 메시지 순환
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

  // 파일 선택
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    setError("");
  };

  // 파일 제거
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // 업로드 & 분석
  const handleUpload = () => {
    if (!files.length) {
      return setError(currentText.errorNoFile);
    }
    setUploading(true);
    setResultPending(true);
    setShowAnalysisScreen(true);

    setTimeout(() => {
      setUploading(false);
      setResultPending(false);
      setShowAnalysisScreen(false);
      setAnalysisResult({
        title: currentText.analysisTitle,
        confidence: 85,
        recommendation: currentText.recommendation,
      });
    }, 5000);
  };

  const handleDownloadPDF = () => {
    alert("PDF Download not implemented");
  };
  const handleShareResult = () => {
    alert("Share Result not implemented");
  };

  // 현재 언어 제외
  const otherLanguages = languageOptions.filter(
    (item) => item.lang !== language.lang
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 transition-colors">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">
            {currentText.title}
          </h2>
          <div className="flex items-center gap-4">
            {/* 다크 모드 토글 */}
            <label className="relative inline-flex h-6 w-11 items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only"
              />
              <span className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full transition-colors" />
              <span
                className={`
                  absolute left-1 top-1 w-4 h-4 bg-white dark:bg-gray-300 
                  rounded-full transition-transform
                  ${darkMode ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </label>

            {/* 언어 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <span className="text-xl dark:text-white">
                  {language.flag}
                </span>
                <FaChevronDown className="text-sm dark:text-white" />
              </button>
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="
                      absolute 
                      right-0 
                      mt-1 
                      z-50 
                      bg-white 
                      dark:bg-gray-700 
                      border 
                      dark:border-gray-600 
                      shadow-lg 
                      overflow-hidden 
                      flex 
                      flex-col 
                      rounded-full
                      p-1
                    "
                  >
                    {otherLanguages.map(({ lang, flag }) => (
                      <button
                        key={lang}
                        className="
                          px-3 
                          py-2 
                          hover:bg-gray-200 
                          dark:hover:bg-gray-600 
                          text-left 
                          cursor-pointer 
                          rounded-full
                          flex 
                          items-center
                        "
                        onClick={() => {
                          setLanguage({ lang, flag });
                          setIsLanguageOpen(false);
                        }}
                      >
                        <span className="text-xl dark:text-white">{flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 분석 대기 화면 */}
        {showAnalysisScreen && !analysisResult ? (
          <motion.div
            className="text-center text-xl font-semibold dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {waitingMessage}
          </motion.div>
        ) : (
          <>
            {analysisResult ? (
              <motion.div
                className="p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                  {analysisResult.title}
                </h3>
                <p className="mt-2 dark:text-white">
                  {currentText.confidence}: {analysisResult.confidence}%
                </p>
                <p className="mt-1 dark:text-white">
                  {analysisResult.recommendation}
                </p>
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
              <>
                <p className="text-gray-600 dark:text-gray-200 text-center my-4">
                  {currentText.uploadText}
                </p>
                <label className="p-4 border-dashed border-2 border-gray-400 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all block w-full">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf,.dicom"
                    className="hidden"
                  />
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag & Drop or Click
                  </p>
                </label>
                <ul className="grid grid-cols-1 gap-2 my-4 w-full">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-2 border rounded text-sm w-full dark:border-gray-600"
                    >
                      <span className="dark:text-white">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
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
                  className="w-full bg-blue-500 text-white mt-4 px-4 py-2 rounded disabled:opacity-50"
                  disabled={!files.length || uploading}
                >
                  {uploading ? "Uploading..." : currentText.startAnalysis}
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2 dark:text-red-300">
                    {error}
                  </p>
                )}
              </>
            )}
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
