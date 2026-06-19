/**
 * IP Whitelisting
 * Allow access only from specific IP addresses or ranges
 */

// Default whitelist (update with your actual IPs)
const DEFAULT_WHITELIST: string[] = [
  "127.0.0.1", // Localhost
  "::1", // Localhost IPv6
  // Add your office/admin IPs here
  // "203.0.113.0/24", // Example CIDR range
];

/**
 * Load IP whitelist from environment variable or use default
 */
export function getIpWhitelist(): string[] {
  const envWhitelist = process.env.IP_WHITELIST;
  
  if (envWhitelist) {
    return envWhitelist.split(",").map((ip) => ip.trim());
  }
  
  return DEFAULT_WHITELIST;
}

/**
 * Check if IP address is in whitelist
 */
export function isIpWhitelisted(ip: string): boolean {
  const whitelist = getIpWhitelist();
  
  // Check exact match first
  if (whitelist.includes(ip)) {
    return true;
  }
  
  // Check CIDR ranges
  for (const entry of whitelist) {
    if (entry.includes("/")) {
      if (isIpInCidr(ip, entry)) {
        return true;
      }
    }
  }
  
  // If whitelist is empty or contains "*", allow all
  if (whitelist.length === 0 || whitelist.includes("*")) {
    return true;
  }
  
  return false;
}

/**
 * Check if IP is in CIDR range
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split("/");
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  
  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(range);
  
  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Convert IP address to number
 */
function ipToNumber(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  // Try various headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return "unknown";
}

/**
 * IP whitelist middleware
 */
export function checkIpWhitelist(request: Request): boolean {
  // Skip in development
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  
  const clientIp = getClientIp(request);
  return isIpWhitelisted(clientIp);
}
