import axios from 'axios';
import cheerio from 'cheerio';
import nodemailer from 'nodemailer';

const handler = async (req, res) => {
  const url = "https://www.delhiwatchcompany.com";

  console.log("Fetching URL:", url);

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    console.log("Loaded HTML");

    let emailSent = false;

    $(".FeaturedProduct").each((index, element) => {
      const name = $(element).find(".ProductMeta__Title a").text().trim();
      const price = $(element).find(".ProductMeta__Price .money").text().trim();
      const availability = $(element).find(".ProductForm__AddToCart").text().trim();

      console.log(`Watch: ${name} - Price: ${price} - Availability: ${availability}`);

      if (availability.toLowerCase() !== "old out") {
        sendEmail(name, price, availability);
        emailSent = true; 
      }
    });

    res.status(200).json({ message: 'Scraping completed' });
  } catch (error) {
    console.error(`Error fetching the URL: ${error}`);
    res.status(500).json({ error: 'Failed to fetch the URL' });
  }
};

async function sendEmail(name, price, availability) {
  // Create a Nodemailer transporter using SMTP
  console.log("in email")
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 465, 
    secure: true,
    auth: {
      user: process.env.FROMEMAIL, 
      pass: process.env.PASSWORD
    }
  });

  // Email content
  let mailOptions = {
    from: process.env.FROMEMAIL,
    to: process.env.TOEMAIL,
    subject: 'Watch Availability Notification',
    text: `Watch: ${name}\nPrice: ${price}\nAvailability: ${availability}`
  };
console.log("sending email")
  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!', info.response);
  } catch (error) {
    console.log("Error", error)
    console.error('Failed to send email.', error);
  }
}

export default handler;
