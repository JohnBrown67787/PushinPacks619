/**
 * Telegram Bot Integration
 * Sends order invoices to configured Telegram destination
 */

export async function POST(request) {
  try {
    const { orderReference, invoice } = await request.json();

    if (!invoice || !orderReference) {
      return Response.json(
        { success: false, error: 'Missing invoice or order reference' },
        { status: 400 }
      );
    }

    // Get Telegram bot token and chat ID from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram configuration missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID');
      // Return success even if not configured - user can still send manually
      return Response.json(
        {
          success: true,
          message: 'Order reference recorded. Manual Telegram delivery available.',
          orderReference
        },
        { status: 200 }
      );
    }

    // Send invoice message to Telegram via bot API
    const message = `📋 *New Order: ${orderReference}*\n\n${invoice}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
      // Still return success - user can send manually
      return Response.json(
        {
          success: true,
          message: 'Order registered. Manual Telegram delivery available.',
          orderReference
        },
        { status: 200 }
      );
    }

    const result = await response.json();

    return Response.json(
      {
        success: true,
        message: 'Invoice sent to Telegram successfully',
        orderReference,
        messageId: result.result?.message_id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Telegram route error:', error);

    // Return success - order is saved, Telegram delivery is optional
    return Response.json(
      {
        success: true,
        message: 'Order registered. Telegram notification unavailable.',
        error: error.message
      },
      { status: 200 }
    );
  }
}
