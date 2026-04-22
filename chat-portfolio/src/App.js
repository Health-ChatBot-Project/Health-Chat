import Home from "./pages/Home";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <div>
      {/* Home Page */}
      <Home />

      {/* Chatbot appears everywhere */}
      <Chatbot />
    </div>
  );
}

export default App;