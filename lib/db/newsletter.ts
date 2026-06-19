/**
 * Newsletter Management Functions
 * 
 * Database operations for newsletter subscribers
 */

import { prisma } from '@/lib/prisma';

interface CreateSubscriberData {
  email: string;
  name?: string;
  source?: string;
  interests?: string[];
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(data: CreateSubscriberData) {
  try {
    // Check if already subscribed
    const existing = await prisma.newsletter_subscribers.findUnique({
      where: { email: data.email },
    });
    
    if (existing) {
      // If unsubscribed, resubscribe
      if (existing.status === "UNSUBSCRIBED") {
        const subscriber = await prisma.newsletter_subscribers.update({
          where: { email: data.email },
          data: {
            status: "ACTIVE",
            subscribedAt: new Date(),
            unsubscribedAt: null,
            name: data.name || existing.name,
            interests: data.interests || existing.interests,
          },
        });
        
        return { success: true, subscriber, isNew: false };
      }
      
      // Already subscribed
      return { success: true, subscriber: existing, isNew: false };
    }
    
    // Create new subscriber
    const subscriber = await prisma.newsletter_subscribers.create({
      data: {
        email: data.email,
        name: data.name,
        source: data.source || 'website',
        interests: data.interests || [],
        status: "ACTIVE",
      },
    });
    
    return { success: true, subscriber, isNew: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletter_subscribers.update({
      where: { email },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { success: false, error: 'Failed to unsubscribe' };
  }
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string) {
  try {
    const subscriber = await prisma.newsletter_subscribers.findUnique({
      where: { email },
    });
    
    if (!subscriber) {
      return { success: false, error: 'Subscriber not found' };
    }
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    return { success: false, error: 'Failed to fetch subscriber' };
  }
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers(page: number = 1, limit: number = 100) {
  try {
    const skip = (page - 1) * limit;
    
    const [subscribers, total] = await Promise.all([
      prisma.newsletter_subscribers.findMany({
        where: { status: "ACTIVE" },
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletter_subscribers.count({ where: { status: "ACTIVE" } }),
    ]);
    
    return {
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    return { success: false, error: 'Failed to fetch subscribers' };
  }
}

/**
 * Get all subscribers (for admin dashboard)
 */
export async function getAllSubscribers(page: number = 1, limit: number = 50) {
  try {
    const skip = (page - 1) * limit;
    
    const [subscribers, total] = await Promise.all([
      prisma.newsletter_subscribers.findMany({
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletter_subscribers.count(),
    ]);
    
    return {
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { success: false, error: 'Failed to fetch subscribers' };
  }
}

/**
 * Update subscriber engagement metrics
 */
export async function updateSubscriberEngagement(
  email: string,
  type: 'sent' | 'opened' | 'clicked'
) {
  try {
    const updates: any = {
      lastEmailSent: type === 'sent' ? new Date() : undefined,
    };
    
    if (type === 'sent') {
      updates.emailsSent = { increment: 1 };
    } else if (type === 'opened') {
      updates.emailsOpened = { increment: 1 };
    } else if (type === 'clicked') {
      updates.emailsClicked = { increment: 1 };
    }
    
    const subscriber = await prisma.newsletter_subscribers.update({
      where: { email },
      data: updates,
    });
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error updating subscriber engagement:', error);
    return { success: false, error: 'Failed to update engagement' };
  }
}

/**
 * Mark email as bounced
 */
export async function markEmailBounced(email: string) {
  try {
    const subscriber = await prisma.newsletter_subscribers.update({
      where: { email },
      data: { status: "BOUNCED" },
    });
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error marking email as bounced:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * Mark email as complained (spam)
 */
export async function markEmailComplained(email: string) {
  try {
    const subscriber = await prisma.newsletter_subscribers.update({
      where: { email },
      data: { status: "COMPLAINED" },
    });
    
    return { success: true, subscriber };
  } catch (error) {
    console.error('Error marking email as complained:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * Get newsletter statistics
 */
export async function getNewsletterStats() {
  try {
    const [
      totalSubscribers,
      activeSubscribers,
      unsubscribed,
      bounced,
      newThisMonth,
      engagementStats,
    ] = await Promise.all([
      prisma.newsletter_subscribers.count(),
      prisma.newsletter_subscribers.count({ where: { status: "ACTIVE" } }),
      prisma.newsletter_subscribers.count({ where: { status: "UNSUBSCRIBED" } }),
      prisma.newsletter_subscribers.count({ where: { status: "BOUNCED" } }),
      prisma.newsletter_subscribers.count({
        where: {
          subscribedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.newsletter_subscribers.aggregate({
        where: { status: "ACTIVE" },
        _sum: {
          emailsSent: true,
          emailsOpened: true,
          emailsClicked: true,
        },
      }),
    ]);
    
    const totalSent = engagementStats._sum.emailsSent || 0;
    const totalOpened = engagementStats._sum.emailsOpened || 0;
    const totalClicked = engagementStats._sum.emailsClicked || 0;
    
    return {
      success: true,
      stats: {
        totalSubscribers,
        activeSubscribers,
        unsubscribed,
        bounced,
        newThisMonth,
        openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
        clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
        growthRate: totalSubscribers > 0 ? (newThisMonth / totalSubscribers) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

/**
 * Search subscribers
 */
export async function searchSubscribers(query: string) {
  try {
    const subscribers = await prisma.newsletter_subscribers.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { subscribedAt: 'desc' },
    });
    
    return { success: true, subscribers };
  } catch (error) {
    console.error('Error searching subscribers:', error);
    return { success: false, error: 'Failed to search subscribers' };
  }
}
