import { stripe } from '@/lib/stripe'

/**
 * Check if billing information is complete in Stripe
 * Requires: name, VAT number, and address (line1, postal_code, city)
 */
export async function checkBillingInfoComplete(
  stripeCustomerId: string | null
): Promise<boolean> {
  if (!stripeCustomerId) return false

  try {
    // Fetch customer from Stripe
    const customer = await stripe.customers.retrieve(stripeCustomerId)

    // Check if customer was deleted
    if (customer.deleted) return false

    // Check 1: Company name exists
    if (!customer.name || !customer.name.trim()) {
      return false
    }

    // Check 2: VAT number exists
    const taxIds = await stripe.customers.listTaxIds(stripeCustomerId)
    const hasVat = taxIds.data.some((tax) => tax.type === 'eu_vat')
    if (!hasVat) {
      return false
    }

    // Check 3: Address has required fields (line1, postal_code, city)
    const address = customer.address
    if (
      !address?.line1?.trim() ||
      !address?.postal_code?.trim() ||
      !address?.city?.trim()
    ) {
      return false
    }

    // All checks passed
    return true
  } catch (error) {
    console.error('Error checking billing info:', error)
    return false
  }
}
