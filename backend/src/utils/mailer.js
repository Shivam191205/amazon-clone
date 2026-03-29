/**
 * Mailer Utility (Nodemailer + Ethereal)
 * 
 * Uses mock Ethereal SMTP to send a full email. The terminal will log
 * a preview URL that you can open to see the formatted HTML email.
 */

const nodemailer = require('nodemailer');

const sendOrderConfirmation = async (user, order) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(order.totalAmount);

    // Order ID formatted
    const displayOrderId = `ORD-${order.id.toString().padStart(6, '0')}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Amazon Clone 🛒" <noreply@amazon-clone.com>', // sender address
      to: user.email, // list of receivers
      subject: `Your Amazon Clone order ${displayOrderId} has been successfully placed`, // Subject line
      text: `Hello ${user.name},\n\nThank you for your order!\n\nOrder ID: ${displayOrderId}\nTotal: ${formattedTotal}\nStatus: Confirmed\n\nWe will send a confirmation when your items ship.`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ff9900;">Order Confirmation</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for shopping with us! Your order has been successfully placed.</p>
          
          <div style="background-color: #f6f6f6; border: 1px solid #e7e7e7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details</h4>
            <table style="width: 100%;">
              <tr>
                <td style="padding-bottom: 5px; color: #666;">Order ID:</td>
                <td style="text-align: right; font-weight: bold;">${displayOrderId}</td>
              </tr>
              <tr>
                <td style="padding-top: 5px; color: #666;">Total Amount:</td>
                <td style="text-align: right; font-weight: bold; font-size: 18px; color: #B12704;">${formattedTotal}</td>
              </tr>
              <tr>
                <td style="padding-top: 5px; color: #666;">Status:</td>
                <td style="text-align: right; font-weight: bold; color: #007600;">Confirmed</td>
              </tr>
            </table>
          </div>
          
          <p>We'll notify you again when your items ship.</p>
          
          <a href="http://localhost:3000/orders" style="display: inline-block; background-color: #ffd814; color: #0f1111; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; margin-top: 10px; border: 1px solid #fcd200;">View Your Order History</a>
          
          <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;" />
          <p style="font-size: 12px; color: #767676; text-align: center;">This is an automated message from the Amazon Clone demo project.</p>
        </div>
      `, // html body
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("==========================================");
    console.log("📧 Order Confirmation Email Sent!");
    console.log("Message sent: %s", info.messageId);
    console.log("🚨 PREVIEW URL: %s", previewUrl);
    console.log("==========================================");

    return previewUrl;
  } catch (error) {
    console.error("Email sending failed:", error);
    return null;
  }
};

module.exports = { sendOrderConfirmation };
