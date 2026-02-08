// Fannoh Naturals Payment Service
// Supports M-Pesa (Daraja API), Paystack, and Bank Transfer

export type PaymentMethod = 'mpesa' | 'card' | 'bank-transfer'

export interface PaymentDetails {
  orderId: string
  amount: number
  currency: 'KES' | 'USD' | 'EUR'
  method: PaymentMethod
  phoneNumber?: string
  email: string
  customerName: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  checkoutRequestId?: string
  message: string
  redirectUrl?: string
  error?: string
}

// M-Pesa Configuration
const MPESA_CONFIG = {
  // Use sandbox in development, production in prod
  baseUrl: process.env.MPESA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke',
  shortCode: process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY || '',
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/mpesa/callback`
}

// Token cache
let mpesaTokenCache: { token: string; expiresAt: number } | null = null

// Format phone number to M-Pesa format (254XXXXXXXXX)
export function formatMpesaPhone(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '')
  
  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1)
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.slice(1)
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  
  return cleaned
}

// Generate M-Pesa timestamp
function getMpesaTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

// Generate M-Pesa password
function getMpesaPassword(timestamp: string): string {
  const str = `${MPESA_CONFIG.shortCode}${MPESA_CONFIG.passkey}${timestamp}`
  return Buffer.from(str).toString('base64')
}

// Get M-Pesa OAuth token with caching
async function getMpesaToken(): Promise<string> {
  // Check cache
  if (mpesaTokenCache && mpesaTokenCache.expiresAt > Date.now()) {
    return mpesaTokenCache.token
  }

  const auth = Buffer.from(
    `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
  ).toString('base64')

  const response = await fetch(
    `${MPESA_CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get M-Pesa token: ${error}`)
  }

  const data = await response.json()
  
  // Cache token (expires in ~1 hour, we cache for 50 mins)
  mpesaTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (50 * 60 * 1000)
  }

  return data.access_token
}

// M-Pesa STK Push Payment
export async function processMpesaPayment(
  details: PaymentDetails & { phoneNumber: string }
): Promise<PaymentResponse> {
  try {
    // Validate configuration
    if (!MPESA_CONFIG.shortCode || !MPESA_CONFIG.passkey) {
      console.warn('M-Pesa not configured, returning mock response')
      return {
        success: true,
        transactionId: `MOCK-${Date.now()}`,
        checkoutRequestId: `ws_CO_${Date.now()}`,
        message: 'Development mode: M-Pesa payment simulated. Configure MPESA_* env vars for production.'
      }
    }

    const token = await getMpesaToken()
    const timestamp = getMpesaTimestamp()
    const password = getMpesaPassword(timestamp)
    const phone = formatMpesaPhone(details.phoneNumber)

    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(details.amount), // M-Pesa requires whole numbers
      PartyA: phone,
      PartyB: MPESA_CONFIG.shortCode,
      PhoneNumber: phone,
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: details.orderId.slice(0, 12), // Max 12 chars
      TransactionDesc: `Fannoh Naturals Order`
    }

    const response = await fetch(
      `${MPESA_CONFIG.baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    const data = await response.json()

    if (data.ResponseCode === '0') {
      return {
        success: true,
        transactionId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        message: 'Please check your phone and enter your M-Pesa PIN to complete payment.'
      }
    } else {
      return {
        success: false,
        message: data.ResponseDescription || 'M-Pesa request failed',
        error: data.errorMessage || data.ResponseDescription
      }
    }
  } catch (error) {
    console.error('M-Pesa payment error:', error)
    return {
      success: false,
      message: 'Failed to initiate M-Pesa payment. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Query M-Pesa transaction status
export async function queryMpesaStatus(checkoutRequestId: string): Promise<{
  success: boolean
  resultCode?: string
  resultDesc?: string
}> {
  try {
    if (!MPESA_CONFIG.shortCode || !MPESA_CONFIG.passkey) {
      return { success: true, resultCode: '0', resultDesc: 'Mock success' }
    }

    const token = await getMpesaToken()
    const timestamp = getMpesaTimestamp()
    const password = getMpesaPassword(timestamp)

    const response = await fetch(
      `${MPESA_CONFIG.baseUrl}/mpesa/stkpushquery/v1/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_CONFIG.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        })
      }
    )

    const data = await response.json()

    return {
      success: data.ResultCode === '0',
      resultCode: data.ResultCode,
      resultDesc: data.ResultDesc
    }
  } catch (error) {
    console.error('M-Pesa status query error:', error)
    return { success: false, resultDesc: 'Failed to query status' }
  }
}

// Card Payment via Paystack (primary) - Stripe removed as Paystack is configured
export async function processCardPayment(
  details: PaymentDetails
): Promise<PaymentResponse> {
  // Card payments are handled via Paystack on the frontend
  // This function is kept for API consistency
  return {
    success: false,
    message: 'Card payments should be processed via Paystack checkout',
    error: 'Use /api/payments/initialize endpoint for card payments'
  }
}

// Bank Transfer Instructions
export async function initiateTransferPayment(
  details: PaymentDetails
): Promise<PaymentResponse> {
  const transferRef = `FAN-${details.orderId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`

  // Bank details for Fannoh Naturals
  const bankDetails = {
    bankName: 'Kenya Commercial Bank (KCB)',
    accountName: 'Fannoh Naturals Ltd',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || 'XXXXXXXXXX',
    branch: 'Nairobi',
    reference: transferRef
  }

  return {
    success: true,
    transactionId: transferRef,
    message: `Please transfer KES ${details.amount.toLocaleString()} to:\n\nBank: ${bankDetails.bankName}\nAccount: ${bankDetails.accountName}\nA/C No: ${bankDetails.accountNumber}\nReference: ${transferRef}\n\nComplete within 24 hours.`,
    redirectUrl: `/order-confirmation?method=bank-transfer&ref=${transferRef}`
  }
}

// Payment Verification
export async function verifyPayment(
  transactionId: string,
  method: PaymentMethod
): Promise<{ verified: boolean; status?: string; details?: any }> {
  try {
    switch (method) {
      case 'mpesa':
        const mpesaResult = await queryMpesaStatus(transactionId)
        return { 
          verified: mpesaResult.success, 
          status: mpesaResult.resultDesc 
        }
      
      case 'card':
        // Paystack verification is handled in /api/payments/verify
        return { verified: true, status: 'Check Paystack dashboard' }
      
      case 'bank-transfer':
        // Bank transfers require manual verification
        return { verified: false, status: 'Pending manual verification' }
      
      default:
        return { verified: false, status: 'Unknown payment method' }
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return { verified: false, status: 'Verification failed' }
  }
}

// Refund Processing
export async function processRefund(
  transactionId: string,
  amount: number,
  method: PaymentMethod,
  reason?: string
): Promise<PaymentResponse> {
  try {
    switch (method) {
      case 'mpesa':
        // M-Pesa refunds via B2C (Business to Customer) API
        // Requires additional Daraja API setup
        return {
          success: false,
          message: 'M-Pesa refunds must be processed manually. Customer will be contacted.',
          transactionId
        }
      
      case 'card':
        // Paystack refund
        if (!process.env.PAYSTACK_SECRET_KEY) {
          return { success: false, message: 'Paystack not configured' }
        }
        
        const response = await fetch('https://api.paystack.co/refund', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transaction: transactionId,
            amount: amount * 100, // Convert to kobo
            merchant_note: reason || 'Customer refund request'
          })
        })
        
        const data = await response.json()
        return {
          success: data.status,
          transactionId: data.data?.id,
          message: data.message
        }
      
      case 'bank-transfer':
        return {
          success: false,
          message: 'Bank transfer refunds require manual processing',
          transactionId
        }
      
      default:
        return { success: false, message: 'Unknown payment method' }
    }
  } catch (error) {
    console.error('Refund processing error:', error)
    return {
      success: false,
      message: 'Failed to process refund',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Calculate Payment Amount with Fees (informational)
export function calculatePaymentAmount(
  subtotal: number,
  shippingCost: number = 0,
  paymentMethod: PaymentMethod = 'card'
): { total: number; fees: number; breakdown: string } {
  let fees = 0
  const baseTotal = subtotal + shippingCost

  switch (paymentMethod) {
    case 'mpesa':
      // M-Pesa Paybill: No fees for customer, merchant pays ~0.5%
      fees = 0
      break
    case 'card':
      // Paystack Kenya: 1.5% + KES 100 (capped at KES 2,000)
      fees = Math.min(baseTotal * 0.015 + 100, 2000)
      break
    case 'bank-transfer':
      // No processing fees
      fees = 0
      break
  }

  return {
    total: Math.round(baseTotal * 100) / 100,
    fees: Math.round(fees * 100) / 100,
    breakdown: `Subtotal: KES ${subtotal.toLocaleString()}, Shipping: KES ${shippingCost.toLocaleString()}`
  }
}

// Format Price for Display
export function formatPrice(
  amount: number,
  currency: string = 'KES'
): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Validate payment method availability
export function isPaymentMethodAvailable(method: PaymentMethod): boolean {
  switch (method) {
    case 'mpesa':
      return !!process.env.MPESA_CONSUMER_KEY || process.env.NODE_ENV === 'development'
    case 'card':
      return !!process.env.PAYSTACK_SECRET_KEY || process.env.NODE_ENV === 'development'
    case 'bank-transfer':
      return true // Always available
    default:
      return false
  }
}

// Get available payment methods
export function getAvailablePaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = []
  if (isPaymentMethodAvailable('mpesa')) methods.push('mpesa')
  if (isPaymentMethodAvailable('card')) methods.push('card')
  if (isPaymentMethodAvailable('bank-transfer')) methods.push('bank-transfer')
  return methods
}

