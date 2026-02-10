import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface SendOrderConfirmationParams {
  to: string
  customerName: string
  orderReference: string
  orderTotal: number
  items: OrderItem[]
  paymentMethod?: string
}

interface SendShippingNotificationParams {
  to: string
  customerName: string
  orderReference: string
  trackingNumber?: string
  estimatedDelivery?: string
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation({
  to,
  customerName,
  orderReference,
  orderTotal,
  items,
  paymentMethod = 'Paystack'
}: SendOrderConfirmationParams) {
  const itemsList = items.map(item =>
    `• ${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}`
  ).join('\n')

  try {
    const { data, error } = await resend.emails.send({
      from: 'NexaMart Marketplace <onboarding@resend.dev>',
      to: [to],
      subject: `Order Confirmed - ${orderReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin-bottom: 5px;">NexaMart Marketplace</h1>
            <p style="color: #B8860B; font-size: 12px; letter-spacing: 2px; margin: 0;">PREMIUM SKINCARE & BEAUTY SOLUTIONS</p>
          </div>

          <div style="background: linear-gradient(135deg, #f8f4ef 0%, #f0e8dd 100%); border-radius: 16px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Thank you for your order, ${customerName}! 🎉</h2>
            <p style="color: #666;">We've received your order and are preparing it for shipment.</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1a1a1a;">Order Details</h3>
            <p><strong>Order Reference:</strong> ${orderReference}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
            
            <h4 style="color: #1a1a1a; margin-bottom: 10px;">Items Ordered:</h4>
            <div style="background: #fafafa; padding: 15px; border-radius: 8px; font-family: monospace; white-space: pre-line;">
${itemsList}
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
            
            <div style="text-align: right;">
              <p style="font-size: 18px; color: #1a1a1a;"><strong>Total: KES ${orderTotal.toLocaleString()}</strong></p>
            </div>
          </div>

          <div style="background: #f0f9f0; border: 1px solid #c8e6c9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #2e7d32; margin-top: 0;">What's Next?</h4>
            <ol style="color: #666; padding-left: 20px;">
              <li>We're preparing your order for shipment</li>
              <li>You'll receive a shipping notification with tracking info</li>
              <li>Your skincare essentials will arrive soon!</li>
            </ol>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Questions? Reply to this email or contact us at hello@nexamart.com</p>
            <p>© ${new Date().getFullYear()} NexaMart Marketplace. All rights reserved.</p>
            <p>Nairobi, Kenya</p>
          </div>

        </body>
        </html>
      `,
    }
      //     return `
      //     <!DOCTYPE html>
      //     <html>
      //       <head>
      //         <meta charset="utf-8">
      //         <style>
      //           body { font-family: Arial, sans-serif; color: #333; }
      //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      //           .header { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
      //           .order-number { font-size: 24px; font-weight: bold; color: #1f2937; }
      //           .items { margin: 20px 0; }
      //           .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
      //           .totals { margin: 20px 0; }
      //           .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-weight: bold; }
      //           .shipping-address { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
      //           .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      //         </style>
      //       </head>
      //       <body>
      //         <div class="container">
      //           <div class="header">
      //             <p>Hello ${data.customerName},</p>
      //             <p class="order-number">Order #${data.orderNumber}</p>
      //             <p>Thank you for your purchase! Your order has been confirmed.</p>
      //           </div>

      //           <h2>Order Details</h2>
      //           <div class="items">
      //             ${data.items.map((item) => `
      //               <div class="item">
      //                 <span>${item.name} x ${item.quantity}</span>
      //                 <span>KES {(item.price * item.quantity).toFixed(2)}</span>
      //               </div>
      //             `).join("")}
      //           </div>

      //           <div class="totals">
      //             <div class="item">
      //               <span>Subtotal</span>
      //               <span>KES {data.subtotal.toFixed(2)}</span>
      //             </div>
      //             <div class="item">
      //               <span>Shipping (${data.shippingMethod === "express" ? "Express" : "Standard"})</span>
      //               <span>KES {data.shippingCost.toFixed(2)}</span>
      //             </div>
      //             <div class="item">
      //               <span>Tax</span>
      //               <span>KES {data.tax.toFixed(2)}</span>
      //             </div>
      //             <div class="total-row" style="font-size: 18px;">
      //               <span>Total</span>
      //               <span>KES {data.totalAmount.toFixed(2)}</span>
      //             </div>
      //           </div>

      //           <h3>Shipping Address</h3>
      //           <div class="shipping-address">
      //             <p><strong>${data.shippingAddress.fullName}</strong></p>
      //             <p>${data.shippingAddress.streetAddress}</p>
      //             <p>${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
      //             <p>${data.shippingAddress.country}</p>
      //           </div>

      //           ${data.paymentMethod === "bank_transfer" ? `
      //             <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      //               <p><strong>Bank Transfer Required</strong></p>
      //               <p>Your order is pending bank transfer. Please check your email for bank details.</p>
      //               <p>Once we receive your payment, we'll process your order immediately.</p>
      //             </div>
      //           ` : ""}

      //           <h3>Estimated Delivery</h3>
      //           <p>${data.estimatedDelivery || (data.shippingMethod === "express" ? "1-2 business days" : "3-5 business days")}</p>

      //           <p>You'll receive a shipping notification with tracking information once your order is dispatched.</p>

      //           <div class="footer">
      //             <p>&copy; 2024 NexaMart Marketplace. All rights reserved.</p>
      //             <p>Questions? Contact us at support@nexamart.com</p>
      //           </div>
      //         </div>
      //       </body>
      //     </html>
      //   `
      // }
    )

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotification({
  to,
  customerName,
  orderReference,
  trackingNumber,
  estimatedDelivery
}: SendShippingNotificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NexaMart Marketplace <onboarding@resend.dev>',
      to: [to],
      subject: `Your Order Has Shipped! - ${orderReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin-bottom: 5px;">NexaMart Marketplace</h1>
            <p style="color: #B8860B; font-size: 12px; letter-spacing: 2px; margin: 0;">PREMIUM SKINCARE & BEAUTY SOLUTIONS</p>
          </div>

          <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 16px; padding: 30px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: #1565c0; margin-top: 0;">📦 Your Order is On Its Way!</h2>
            <p style="color: #666;">Hi ${customerName}, great news! Your package has shipped.</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p><strong>Order Reference:</strong> ${orderReference}</p>
            ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
            ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ''}
            ${trackingNumber ? `
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://t.17track.net/en#nums=${encodeURIComponent(trackingNumber)}" 
                   style="display: inline-block; background-color: #B8860B; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  📍 Track Your Order
                </a>
              </div>
            ` : ''}
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Questions? Reply to this email or contact us at hello@nexamart.com</p>
            <p>© ${new Date().getFullYear()} NexaMart Marketplace. All rights reserved.</p>
          </div>

        </body>
        </html>
      `,
    }
      // <!DOCTYPE html>
      // <html>
      //   <head>
      //     <meta charset="utf-8">
      //     <style>
      //       body { font-family: Arial, sans-serif; color: #333; }
      //       .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      //       .header { background-color: #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
      //       .tracking-info { background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #86efac; }
      //       .tracking-link { display: inline-block; background-color: #22c55e; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
      //     </style>
      //   </head>
      //   <body>
      //     <div class="container">
      //       <div class="header">
      //         <p><strong>Your order is on the way!</strong></p>
      //         <p>Order #${data.orderNumber}</p>
      //       </div>

      //       <p>Good news! Your order has been shipped and is on its way to you.</p>

      //       <div class="tracking-info">
      //         <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
      //         <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
      //         <p><a href="${data.trackingUrl}" class="tracking-link">Track Your Order</a></p>
      //       </div>

      //       <p>Thank you for shopping with NexaMart Marketplace!</p>
      //     </div>
      //   </body>
      // </html>
    )

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}

interface SendDeliveryConfirmationParams {
  to: string
  customerName: string
  orderReference: string
}

/**
 * Send delivery confirmation email
 */
export async function sendDeliveryConfirmation({
  to,
  customerName,
  orderReference
}: SendDeliveryConfirmationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NexaMart Marketplace <onboarding@resend.dev>',
      to: [to],
      subject: `Your Order Has Been Delivered! - ${orderReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; color: #1a1a1a; margin-bottom: 5px;">NexaMart Marketplace</h1>
            <p style="color: #B8860B; font-size: 12px; letter-spacing: 2px; margin: 0;">PREMIUM SKINCARE & BEAUTY SOLUTIONS</p>
          </div>

          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 16px; padding: 30px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: #065f46; margin-top: 0;">Your Order Has Arrived!</h2>
            <p style="color: #666;">Hi ${customerName}, your package has been delivered.</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p><strong>Order Reference:</strong> ${orderReference}</p>
            <p>We hope you love your new skincare products!</p>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #92400e; margin-top: 0;">Quick Tips for Best Results</h4>
            <ul style="color: #666; padding-left: 20px;">
              <li>Always do a patch test before first use</li>
              <li>Store products in a cool, dry place</li>
              <li>Follow the directions on each product</li>
              <li>Be consistent for best results</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <p>Love your products? Leave us a review!</p>
            <a href="https://nexamart.com/shop" style="display: inline-block; background: #B8860B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Shop Again</a>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Questions? Reply to this email or contact us at hello@nexamart.com</p>
            <p>${new Date().getFullYear()} NexaMart Marketplace. All rights reserved.</p>
          </div>

        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}

/**
 * Send promotional newsletter to subscribers
 */
interface SendNewsletterParams {
  to: string[]
  subject: string
  heading: string
  body: string
  ctaText?: string
  ctaUrl?: string
}

export async function sendNewsletter({
  to,
  subject,
  heading,
  body,
  ctaText,
  ctaUrl
}: SendNewsletterParams) {
  const batchSize = 50
  const results: { batch: number; success: boolean; error?: unknown; data?: unknown; count?: number }[] = []

  for (let i = 0; i < to.length; i += batchSize) {
    const batch = to.slice(i, i + batchSize)

    try {
      const { data, error } = await resend.emails.send({
        from: 'NexaMart Marketplace <onboarding@resend.dev>',
        to: batch,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
            
            <div style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; text-align: center;">
                <h1 style="font-size: 28px; color: #fff; margin-bottom: 5px; font-family: Georgia, serif;">NexaMart Marketplace</h1>
                <p style="color: #B8860B; font-size: 12px; letter-spacing: 2px; margin: 0;">PREMIUM SKINCARE &amp; BEAUTY SOLUTIONS</p>
              </div>

              <div style="padding: 30px;">
                <h2 style="color: #1a1a1a; font-size: 24px; margin-top: 0; font-family: Georgia, serif;">${heading}</h2>
                
                <div style="color: #555; font-size: 16px; line-height: 1.8;">
                  ${body.replace(/\n/g, '<br>')}
                </div>

                ${ctaText && ctaUrl ? `
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${ctaUrl}" style="display: inline-block; background: #B8860B; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">${ctaText}</a>
                  </div>
                ` : ''}
              </div>

              <div style="background: #fafafa; padding: 20px 30px; border-top: 1px solid #eee;">
                <div style="text-align: center; color: #999; font-size: 12px;">
                  <p>You received this because you subscribed to NexaMart Marketplace newsletter.</p>
                  <p>&copy; ${new Date().getFullYear()} NexaMart Marketplace. All rights reserved.</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>

          </body>
          </html>
        `,
      })

      if (error) {
        console.error('Newsletter batch error:', error)
        results.push({ batch: i / batchSize + 1, success: false, error })
      } else {
        results.push({ batch: i / batchSize + 1, success: true, data, count: batch.length })
      }
    } catch (error) {
      console.error('Newsletter service error:', error)
      results.push({ batch: i / batchSize + 1, success: false, error })
    }
  }

  const totalSent = results.filter(r => r.success).reduce((sum, r) => sum + (r.count || 0), 0)
  return { success: totalSent > 0, totalSent, totalFailed: to.length - totalSent, results }
}