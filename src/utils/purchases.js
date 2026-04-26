import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// TODO: remplacer par ta clé Google depuis app.revenuecat.com
// Projet → Android → API Key (commence par "goog_")
const REVENUECAT_GOOGLE_KEY = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Identifiant de l'entitlement créé dans le dashboard RevenueCat
const ENTITLEMENT_ID = 'premium';

export function initPurchases() {
  if (REVENUECAT_GOOGLE_KEY.includes('XXXX')) return; // clé non configurée
  try {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: REVENUECAT_GOOGLE_KEY });
  } catch {
    // Expo Go ne supporte pas les modules natifs RevenueCat
  }
}

// Retourne l'offering courant ou null
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (e) {
    console.error('[Purchases] getOfferings:', e);
    return null;
  }
}

// Lance l'achat d'un package RevenueCat.
// Retourne true si l'entitlement "premium" est actif après l'achat.
// Lève une erreur si l'utilisateur annule (e.userCancelled === true).
export async function purchasePackage(pkg) {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return _hasPremium(customerInfo);
}

// Restaure les achats précédents.
// Retourne true si l'entitlement "premium" est retrouvé.
export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  return _hasPremium(customerInfo);
}

// Vérifie silencieusement si l'utilisateur a un abonnement actif.
// Retourne false en cas d'erreur réseau plutôt que de bloquer.
export async function checkPremiumEntitlement() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return _hasPremium(customerInfo);
  } catch {
    return false;
  }
}

function _hasPremium(customerInfo) {
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
}
