import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>StudyAI - AI-Powered Academic Assistant for University Students</title>
        <meta name="description" content="Plan your studies, generate notes, solve doubts instantly with AI. The ultimate academic productivity platform for university students." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Features />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
