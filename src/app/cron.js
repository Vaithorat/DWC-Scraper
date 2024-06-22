import axios from "axios";

async function callApi() {
  try {
    const response = await axios.get(
      "https://dwc-scraper.vercel.app/api/scraper"
    );
    console.log("API call successful:", response.data);
  } catch (error) {
    console.error("Failed to call API:", error.message);
  }
}

module.exports = async function (req, res) {
  try {
    await callApi();
    res.status(200).send("Scheduled function ran successfully");
  } catch (error) {
    console.error("Error running scheduled function:", error.message);
    res.status(500).send("Scheduled function encountered an error");
  }
};
