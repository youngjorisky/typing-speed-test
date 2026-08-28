import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { TestProvider } from "./context/TestContext";
import { useTest } from "./context/useTest";
import { IdlePage, ResultPage, StartedPage } from "./pages/TestPages";

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <AppLayout />
      </TestProvider>
    </BrowserRouter>
  );
}

function AppLayout() {
  const { personalBest, screen } = useTest();
  return (
    <div className={`typing-speed-container typing-speed-${screen}`}>
      <Header personalBest={personalBest} />
      <section className={`design design-${screen}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/idle" replace />} />
          <Route path="/idle" element={<IdlePage />} />
          <Route path="/started" element={<StartedPage />} />
          <Route path="/results" element={<ResultPage state="results" />} />
          <Route
            path="/first-test"
            element={<ResultPage state="first-test" />}
          />
          <Route
            path="/new-personal-best"
            element={<ResultPage state="new-personal-best" />}
          />
          <Route path="*" element={<Navigate to="/idle" replace />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
