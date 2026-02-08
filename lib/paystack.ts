/**
 * Paystack Payment Service
 * Handles payment initialization and verification
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!


interface PaystackInitializeData {
    email: string
    amount: number // in kobo (smallest currency unit) - multiply KES by 100
    reference?: string
    callback_url?: string
    metadata?: {
        order_id?: string
        customer_name?: string
        cart_items?: string
        [key: string]: unknown
    }
    currency?: string
    channels?: string[]
}

interface PaystackInitializeResponse {
    status: boolean
    message: string
    data: {
        authorization_url: string
        access_code: string
        reference: string
    }
}

interface PaystackVerifyResponse {
    status: boolean
    message: string
    data: {
        id: number
        domain: string
        status: 'success' | 'failed' | 'abandoned'
        reference: string
        amount: number
        currency: string
        channel: string
        customer: {
            email: string
            first_name: string | null
            last_name: string | null
            phone: string | null
        }
        metadata: {
            order_id?: string
            customer_name?: string
            [key: string]: unknown
        }
        paid_at: string
        created_at: string
    }
}

/**
 * Generate a unique payment reference
 */
export function generateReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `FN-${timestamp}-${random}`
}

/**
 * Initialize a Paystack transaction
 */
export async function initializePayment(data: PaystackInitializeData): Promise<PaystackInitializeResponse> {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            currency: data.currency || 'KES',
            channels: data.channels || ['card', 'mobile_money'],
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to initialize payment')
    }

    return response.json()
}

/**
 * Verify a Paystack transaction
 */
export async function verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to verify payment')
    }

    return response.json()
}

/**
 * Convert KES to kobo (smallest unit)
 * Paystack expects amounts in the smallest currency unit
 */
export function toKobo(amount: number): number {
    return Math.round(amount * 100)
}

/**
 * Convert kobo back to KES
 */
export function fromKobo(amount: number): number {
    return amount / 100
}
