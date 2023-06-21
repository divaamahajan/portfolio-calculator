import InputForm from "../components/InputForm";
import "../styles/Page.css";
// import VisualisationTabs from '../components/VisualisationTabs'
export default async function Home() {
  return (
    <main>
      <h1 className="flex justify-center m-10 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-customColor font-sans shadow-xl">
          Portfolio Allocation Analyzer
        </span>
      </h1>
      <InputForm />
      {/* {tradingData && userInputData && (
      <VisualisationTabs tradingData={tradingData} userInputData={userInputData} />
    )}
    {!tradingData && console.log('tradingData is blank')}
    {!userInputData && console.log('userInputData is blank')} */}
    </main>
  );
}
