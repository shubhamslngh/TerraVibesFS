import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Home/page";
import InquiryForm from "../components/InquiryForm";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inquiry" element={<InquiryForm />} />
      </Routes>
    </BrowserRouter>
  );
}
