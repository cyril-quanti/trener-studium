import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BlockPage } from "./pages/BlockPage";
import { TopicPage } from "./pages/TopicPage";
import { FlashcardSessionPage } from "./pages/FlashcardSessionPage";
import { ExamChoicePage } from "./pages/ExamChoicePage";
import { ExamRunPage } from "./pages/ExamRunPage";
import { QuestionPracticePage } from "./pages/QuestionPracticePage";
import { SettingsPage } from "./pages/SettingsPage";
import { AppStateProvider } from "./state/AppStateContext";

export function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blok/:blockId" element={<BlockPage />} />
            <Route path="/blok/:blockId/:topicId" element={<TopicPage />} />
            <Route path="/karticky" element={<FlashcardSessionPage />} />
            <Route path="/zkouska" element={<ExamChoicePage />} />
            <Route path="/zkouska/beh" element={<ExamRunPage />} />
            <Route path="/otazky" element={<QuestionPracticePage />} />
            <Route path="/nastaveni" element={<SettingsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
